import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { ResponsesService } from './responses.service';
import {
    ResponsesResponse,
    ResponsesSaveRequest,
} from '../model/responses.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/v1/skm/responses')
export class ResponsesController {
    constructor(private responsesService: ResponsesService) {}

    @Post()
    @HttpCode(200)
    async save(
        @Body() request: ResponsesSaveRequest,
    ): Promise<WebResponse<ResponsesResponse>> {
        const result = await this.responsesService.saveResponses(request);

        return {
            data: result,
        };
    }

    @Get('/:responsesId/response')
    @HttpCode(200)
    async getResponsesById(
        @Param('responsesId', ParseIntPipe) responsesId: number,
    ): Promise<WebResponse<ResponsesResponse>> {
        const result =
            await this.responsesService.findResponsesById(responsesId);

        return {
            data: result,
        };
    }

    @Get('/:questionId/all')
    @HttpCode(200)
    async getAllResponsesByQuestionId(
        @Param('questionId', ParseIntPipe) responsesId: number,
    ): Promise<WebResponse<ResponsesResponse[]>> {
        const result =
            await this.responsesService.findAllResponsesByQuestionId(
                responsesId,
            );

        return {
            data: result,
        };
    }

    @Get('/:userId/user')
    @HttpCode(200)
    async getResponsesByUserId(
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<WebResponse<any>> {
        const result =
            await this.responsesService.findResponsesByUserId(userId);

        return {
            data: result,
        };
    }
}
