import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { FormResponse, FormSaveRequest } from '../model/form.model';
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

        const form = await this.prismaService.form.create({
            data: {
                name: validRequest.name,
                description: validRequest.description,
                userId: user.id,
                shareURL: uuid(),
            },
        });

        return form;
    }

    async findAllForm(user: User): Promise<FormResponse[]> {
        const forms = await this.prismaService.form.findMany({
            where: {
                userId: user.id,
            },
        });

        if (!forms) {
            throw new HttpException('form not found', 404);
        }

        return forms;
    }

    async findByIdForm(formId: number): Promise<FormResponse> {
        const validFormId: number = this.validationService.validate(
            FormValidation.FIND_ID,
            formId,
        );

        const form = await this.prismaService.form.findUnique({
            where: {
                id: validFormId,
            },
        });

        if (!form) {
            throw new HttpException('form not found', 404);
        }

        return form;
    }
}
