import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
    FormDetailsRequest,
    FormDetailsResponse,
    FormResponse,
    FormSaveRequest,
    FormUpdateRequest,
} from '../model/form.model';
import { User } from '@prisma/client';
import { FormValidation } from './form.validation';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FormService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}

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
}
