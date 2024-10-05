import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
    FormDetailsRequest,
    FormDetailsResponse,
    FormResponse,
    FormSaveRequest,
    FormTotalStatistics,
    FormUpdateRequest,
    MonthlySubmissionCount,
    SubmissionDistributionByForm,
} from '../model/form.model';
import { FormDetails, User } from '@prisma/client';
import { FormValidation } from './form.validation';
import { v4 as uuid } from 'uuid';
import { toZonedTime } from 'date-fns-tz';
import { endOfMonth, startOfMonth, subDays } from 'date-fns';

@Injectable()
export class FormService {
    private timeZone = 'Asia/Jakarta';

    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}

    private getZonedDate(): Date {
        return toZonedTime(new Date(), this.timeZone);
    }

    async saveForm(
        request: FormSaveRequest,
        user: User,
    ): Promise<FormResponse> {
        console.info(`Save form with request: ${request}`);
        const validRequest: FormSaveRequest = this.validationService.validate(
            FormValidation.SAVE,
            request,
        ) as FormSaveRequest;

        const content = '[]';
        const form = await this.prismaService.form.create({
            data: {
                name: validRequest.name,
                description: validRequest.description,
                userId: user.id,
                shareURL: uuid(),
                content: content,
            },
        });

        return form;
    }

    async findAllForm(user: User): Promise<FormResponse[]> {
        const forms = await this.prismaService.form.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!forms) {
            throw new HttpException('form not found', 404);
        }

        return forms;
    }

    async findByIdForm(formId: number): Promise<FormDetailsResponse> {
        const validFormId: number = this.validationService.validate(
            FormValidation.FIND_ID,
            formId,
        );

        const form = await this.prismaService.form.findUnique({
            where: {
                id: validFormId,
            },
            include: {
                formDetails: true,
            },
        });

        if (!form) {
            throw new HttpException('form not found', 404);
        }

        return form;
    }

    async updateForm(
        user: User,
        request: FormUpdateRequest,
    ): Promise<FormResponse> {
        const validRequest: FormUpdateRequest = this.validationService.validate(
            FormValidation.UPDATE,
            request,
        ) as FormUpdateRequest;

        const findForm = await this.prismaService.form.findFirst({
            where: {
                AND: [
                    {
                        id: validRequest.id,
                    },
                    {
                        userId: user.id,
                    },
                ],
            },
        });

        if (!findForm) {
            throw new HttpException('form not found', 404);
        }

        if (validRequest.content) {
            findForm.content = validRequest.content;
        }

        if (validRequest.published) {
            findForm.published = validRequest.published;
        }

        const form = await this.prismaService.form.update({
            where: {
                id: validRequest.id,
            },
            data: findForm,
        });

        return form;
    }

    async findByUrlForm(shareURL: string): Promise<FormResponse> {
        const validShareURL: string = this.validationService.validate(
            FormValidation.FIND_URL,
            shareURL,
        );

        const findForm = await this.prismaService.form.findFirst({
            where: {
                shareURL: validShareURL,
            },
        });

        if (!findForm) {
            throw new HttpException('form not found', 404);
        }

        const form = await this.prismaService.form.update({
            where: {
                id: findForm.id,
            },
            data: {
                visit: {
                    increment: 1,
                },
            },
        });

        return form;
    }

    async updateFormDetails(
        request: FormDetailsRequest,
    ): Promise<FormDetailsResponse> {
        const validRequest: FormDetailsRequest =
            this.validationService.validate(
                FormValidation.UPDATE_DETAILS,
                request,
            ) as FormDetailsRequest;

        const findForm = await this.prismaService.form.findFirst({
            where: {
                AND: [
                    {
                        shareURL: validRequest.shareURL,
                    },
                    { published: true },
                ],
            },
        });

        if (!findForm) {
            throw new HttpException('form not found', 404);
        }

        if (validRequest.content) {
            findForm.content = validRequest.content;
        }

        const form = await this.prismaService.form.update({
            where: {
                id: findForm.id,
            },
            data: {
                submissions: {
                    increment: 1,
                },
                formDetails: {
                    create: {
                        content: validRequest.content,
                    },
                },
            },
            include: {
                formDetails: true,
            },
        });

        return form;
    }

    async findAllTotalVisits(): Promise<number> {
        const sumVisit = await this.prismaService.form.aggregate({
            _sum: {
                visit: true,
            },
        });

        return sumVisit._sum.visit ? sumVisit._sum.visit : 0;
    }

    async findAllTotalSubmissions(): Promise<number> {
        return await this.prismaService.formDetails.count();
    }

    async findAllTotalSubmissionThisMonth(): Promise<number> {
        const now = this.getZonedDate();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        return await this.prismaService.formDetails.count({
            where: {
                createdAt: {
                    gte: monthStart,
                    lte: monthEnd,
                },
            },
        });
    }

    async findFormStatistics(user: User): Promise<FormTotalStatistics> {
        const countUser = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (countUser === 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const [totalVisit, totalSubmission, totalSubmissionThisMonth] =
            await Promise.all([
                this.findAllTotalVisits(),
                this.findAllTotalSubmissions(),
                this.findAllTotalSubmissionThisMonth(),
            ]);

        return {
            totalVisit,
            totalSubmission,
            totalSubmissionThisMonth,
        };
    }

    async findSubmissionDistributionByForm(
        user: User,
    ): Promise<SubmissionDistributionByForm[]> {
        const countUser = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (countUser === 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const data = await this.prismaService.$queryRaw<
            { form: string | undefined; count: number | null }[]
        >`
        SELECT fm.name as form, COUNT(sm.id) as count
        FROM form_details as sm
        JOIN forms as fm ON (fm.id = sm.formId)
        GROUP by form
        `;

        const mappedData = data.map((value) => {
            return {
                form: value.form,
                count: Number(value.count),
            };
        });

        return mappedData;
    }

    async findMonthlySubmissionCount(
        user: User,
    ): Promise<MonthlySubmissionCount[]> {
        const countUser = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (countUser === 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const endDate = new Date();
        const startDate = subDays(endDate, 30);
        const data = await this.prismaService.$queryRaw<
            { date: Date | undefined; count: number | null }[]
        >`
        SELECT DATE(createdAt) as date, COUNT(*) as count
        FROM form_details
        WHERE createdAt >= ${startDate} AND createdAt <= ${endDate}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
        `;

        const mappedData = data.map((value) => {
            return {
                date: value.date,
                count: Number(value.count),
            };
        });

        return mappedData;
    }

    async removeFormById(formId: number, user: User) {
        const validFormId: number = this.validationService.validate(
            FormValidation.FIND_ID,
            formId,
        );

        const countUser = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (countUser === 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const countForm = await this.prismaService.form.count({
            where: {
                id: validFormId,
            },
        });

        if (countForm === 0) {
            throw new HttpException('form not found', 404);
        }

        const deleteFormDetail = this.prismaService.formDetails.deleteMany({
            where: {
                formId: validFormId,
            },
        });

        const deleteForm = this.prismaService.form.delete({
            where: {
                id: validFormId,
            },
        });

        await this.prismaService.$transaction([deleteFormDetail, deleteForm]);
    }

    async findByIdFormDetails(detailId: number): Promise<FormDetails> {
        const validFormId: number = this.validationService.validate(
            FormValidation.FIND_ID,
            detailId,
        );

        const form = await this.prismaService.formDetails.findUnique({
            where: {
                id: validFormId,
            },
        });

        if (!form) {
            throw new HttpException('form detail not found', 404);
        }

        return form;
    }
}
