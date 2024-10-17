import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RespondenService } from './responden.service';
import { Admin } from '../common/admin.decorator';
import { User } from '@prisma/client';
import {
    RespondenSaveRequest,
    RespondenResponse,
} from '../model/responden.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/v1/skm/responden')
export class RespondenController {
    constructor(private respondenService: RespondenService) {}

    @Post()
    @HttpCode(200)
    async save(
        @Admin() admin: User,
        @Body() request: RespondenSaveRequest,
    ): Promise<WebResponse<RespondenResponse>> {
        const result = await this.respondenService.saveResponden(
            request,
            admin,
        );

        return {
            data: result,
        };
    }
}
