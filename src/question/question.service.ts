import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
    QuestionResponse,
    QuestionSaveRequest,
    QuestionUpdateRequest,
} from '../model/question.model';
import { User } from '@prisma/client';
import { QuestionValidation } from './question.validation';

@Injectable()
export class QuestionService {
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

    async findQuestionById(questionId: number): Promise<QuestionResponse> {
        const validId = this.validationService.validate(
            QuestionValidation.FIND_ID,
            questionId,
        );

        const question = await this.prismaService.question.findUnique({
            where: {
                id: validId,
            },
        });

        if (!question) {
            throw new HttpException('question not found', 404);
        }

        return question;
    }

    async findAllQuestion(): Promise<QuestionResponse[]> {
        const questions = this.prismaService.question.findMany();

        if (!questions) {
            throw new HttpException('question not found', 404);
        }

        return questions;
    }

    async updateQuestion(
        request: QuestionUpdateRequest,
        user: User,
    ): Promise<QuestionResponse> {
        const validRequest: QuestionUpdateRequest =
            this.validationService.validate(
                QuestionValidation.UPDATE,
                request,
            ) as QuestionUpdateRequest;

        const userCount = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (userCount == 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const question = await this.prismaService.question.findUnique({
            where: {
                id: validRequest.id,
            },
        });

        if (!question) {
            throw new HttpException('question not found', 404);
        }

        if (validRequest.question) question.question = validRequest.question;
        if (validRequest.acronim) question.acronim = validRequest.acronim;
        if (validRequest.option_1) question.option_1 = validRequest.option_1;
        if (validRequest.option_2) question.option_2 = validRequest.option_2;
        if (validRequest.option_3) question.option_3 = validRequest.option_3;
        if (validRequest.option_4) question.option_4 = validRequest.option_4;
        if (validRequest.status) question.status = validRequest.status;

        const updatedQuestion = await this.prismaService.question.update({
            where: {
                id: question.id,
            },
            data: question,
        });

        return updatedQuestion;
    }

    async deleteQuestionById(questionId: number, user: User): Promise<string> {
        const validId = this.validationService.validate(
            QuestionValidation.FIND_ID,
            questionId,
        );

        const userCount = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (userCount == 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const question = await this.prismaService.question.findUnique({
            where: {
                id: validId,
            },
        });

        if (!question) {
            throw new HttpException('question not found', 404);
        }

        await this.prismaService.question.delete({
            where: {
                id: question.id,
            },
        });

        return 'OK';
    }
}
