import { Body, Controller, HttpCode, Post } from '@nestjs/common';
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
}
