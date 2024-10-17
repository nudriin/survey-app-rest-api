import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { SkmService } from './skm.service';
import { Admin } from '../common/admin.decorator';
import { User } from '@prisma/client';
import {
    QuestionResponse,
    QuestionSaveRequest,
} from '../../dist/model/skm.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/v1/skm')
export class SkmController {
    constructor(private skmService: SkmService) {}

    @Post()
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
}
