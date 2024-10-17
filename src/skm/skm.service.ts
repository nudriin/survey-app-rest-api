import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
    QuestionResponse,
    QuestionSaveRequest,
} from '../../dist/model/skm.model';
import { User } from '@prisma/client';
import { QuestionValidation } from './skm.validation';

@Injectable()
export class SkmService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}

    async saveQuestion(
        request: QuestionSaveRequest,
        user: User,
    ): Promise<QuestionResponse> {
        const validRequest: QuestionSaveRequest =
            this.validationService.validate(
                QuestionValidation.SAVE,
                request,
            ) as QuestionSaveRequest;

        const userCount = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (userCount == 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const question = await this.prismaService.question.create({
            data: {
                question: validRequest.question,
                acronim: validRequest.acronim,
                option_1: validRequest.option_1,
                option_2: validRequest.option_2,
                option_3: validRequest.option_3,
                option_4: validRequest.option_4,
            },
        });

        return question;
    }
}
