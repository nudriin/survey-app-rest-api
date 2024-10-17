import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { SkmService } from './skm.service';
import { Admin } from '../common/admin.decorator';
import { User } from '@prisma/client';
import { WebResponse } from '../model/web.model';
import {
    QuestionSaveRequest,
    QuestionUpdateRequest,
    QuestionResponse,
} from '../model/skm.model';

@Controller('/api/v1/skm')
export class SkmController {
    constructor(private skmService: SkmService) {}

    @Post('/question')
    @HttpCode(200)
    async createQuestion(
        @Admin() admin: User,
        @Body() request: QuestionSaveRequest,
    ): Promise<WebResponse<QuestionResponse>> {
        const result = await this.skmService.saveQuestion(request, admin);

        return {
            data: result,
        };
    }

    @Get('/question/:id')
    @HttpCode(200)
    async getQuestionById(
        @Param('id', ParseIntPipe) questionId: number,
    ): Promise<WebResponse<QuestionResponse>> {
        const result = await this.skmService.findQuestionById(questionId);

        return {
            data: result,
        };
    }

    @Get('/question')
    @HttpCode(200)
    async getAllQuestion(): Promise<WebResponse<QuestionResponse[]>> {
        const result = await this.skmService.findAllQuestion();

        return {
            data: result,
        };
    }

    @Patch('/question')
    @HttpCode(200)
    async updateQuestion(
        @Admin() admin: User,
        @Body() request: QuestionUpdateRequest,
    ): Promise<WebResponse<QuestionResponse>> {
        const result = await this.skmService.updateQuestion(request, admin);

        return {
            data: result,
        };
    }
}
