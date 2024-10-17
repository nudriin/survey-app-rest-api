import { Body, Controller, HttpCode, Post } from '@nestjs/common';
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
}
