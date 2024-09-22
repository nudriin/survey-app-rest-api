import { Injectable } from '@nestjs/common';
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
}
