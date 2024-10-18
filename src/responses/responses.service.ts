import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
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

        const countQuestion = await this.prismaService.question.count({
            where: {
                id: validRequest.question_id,
            },
        });

        if (countQuestion == 0)
            throw new HttpException('question not found', 404);

        const countResponden = await this.prismaService.responden.count({
            where: {
                id: validRequest.responden_id,
            },
        });

        if (countResponden == 0)
            throw new HttpException('responden not found', 404);

        const responses = await this.prismaService.response.create({
            data: {
                question_id: validRequest.question_id,
                responden_id: validRequest.responden_id,
                select_option: validRequest.select_option,
            },
        });

        return responses;
    }
}
