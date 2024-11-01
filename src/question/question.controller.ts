import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { Admin } from '../common/admin.decorator';
import { User } from '@prisma/client';
import { WebResponse } from '../model/web.model';
import {
    QuestionSaveRequest,
    QuestionUpdateRequest,
    QuestionResponse,
} from '../model/question.model';

@Controller('/api/v1/skm/question')
export class QuestionController {
    constructor(private questionService: QuestionService) {}

    @Post()
    @HttpCode(200)
    async createQuestion(
        @Admin() admin: User,
        @Body() request: QuestionSaveRequest,
    ): Promise<WebResponse<QuestionResponse>> {
        const result = await this.questionService.saveQuestion(request, admin);

        return {
            data: result,
        };
    }

    @Get('/:id')
    @HttpCode(200)
    async getQuestionById(
        @Param('id', ParseIntPipe) questionId: number,
    ): Promise<WebResponse<QuestionResponse>> {
        const result = await this.questionService.findQuestionById(questionId);

        return {
            data: result,
        };
    }

    @Get()
    @HttpCode(200)
    async getAllQuestion(): Promise<WebResponse<QuestionResponse[]>> {
        const result = await this.questionService.findAllQuestion();

        return {
            data: result,
        };
    }

    @Patch()
    @HttpCode(200)
    async updateQuestion(
        @Admin() admin: User,
        @Body() request: QuestionUpdateRequest,
    ): Promise<WebResponse<QuestionResponse>> {
        const result = await this.questionService.updateQuestion(
            request,
            admin,
        );

        return {
            data: result,
        };
    }

    @Delete('/:id')
    @HttpCode(200)
    async deleteQuestion(
        @Param('id', ParseIntPipe) questionId: number,
        @Admin() admin: User,
    ): Promise<WebResponse<string>> {
        const result = await this.questionService.deleteQuestionById(
            questionId,
            admin,
        );

        return {
            data: result,
        };
    }
}
