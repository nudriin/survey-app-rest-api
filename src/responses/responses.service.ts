import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
    ResponsesByUserResponse,
    ResponsesResponse,
    ResponsesSaveRequest,
} from '../model/responses.model';
import { ResponsesValidation } from './responses.validation';

@Injectable()
export class ResponsesService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}

    async saveResponses(
        request: ResponsesSaveRequest,
    ): Promise<ResponsesResponse> {
        const validRequest: ResponsesSaveRequest =
            this.validationService.validate(
                ResponsesValidation.SAVE,
                request,
            ) as ResponsesSaveRequest;

        const question = await this.prismaService.question.findUnique({
            where: {
                id: validRequest.question_id,
            },
        });

        if (!question) throw new HttpException('question not found', 404);

        const countResponden = await this.prismaService.responden.count({
            where: {
                id: validRequest.responden_id,
            },
        });

        if (countResponden == 0)
            throw new HttpException('responden not found', 404);

        const selectedOptionKey = `option_${validRequest.select_option}`;
        const selectedOptionText = question[selectedOptionKey];

        const responses = await this.prismaService.response.create({
            data: {
                question_id: validRequest.question_id,
                responden_id: validRequest.responden_id,
                select_option: validRequest.select_option,
                select_option_text: selectedOptionText,
            },
        });

        return responses;
    }

    async findResponsesById(responsesId: number): Promise<ResponsesResponse> {
        const validId = this.validationService.validate(
            ResponsesValidation.FIND_ID,
            responsesId,
        );

        const response = await this.prismaService.response.findUnique({
            where: { id: validId },
            include: {
                question: true,
                responden: true,
            },
        });

        if (!response) throw new HttpException('responses not found', 404);

        return response;
    }

    async findAllResponsesByQuestionId(
        questionId: number,
    ): Promise<ResponsesResponse[]> {
        const validId = this.validationService.validate(
            ResponsesValidation.FIND_ID,
            questionId,
        );

        const allResponses = await this.prismaService.response.findMany({
            where: {
                question_id: validId,
            },
            include: {
                question: true,
                responden: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        if (!allResponses) throw new HttpException('responses not found', 404);

        return allResponses;
    }

    async findResponsesByUserId(
        userId: number,
    ): Promise<ResponsesByUserResponse[]> {
        const validId = this.validationService.validate(
            ResponsesValidation.FIND_ID,
            userId,
        );

        const userResponses = await this.prismaService.response.findMany({
            where: {
                responden_id: validId,
            },
            include: {
                question: true,
            },
        });

        if (!userResponses) throw new HttpException('responses not found', 404);

        return userResponses;
    }
}
