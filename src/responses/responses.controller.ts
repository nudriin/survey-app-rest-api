import { Controller } from '@nestjs/common';
import { ResponsesService } from './responses.service';

@Controller('/api/v1/skm/responses')
export class ResponsesController {
    constructor(private responsesService: ResponsesService) {}
}
