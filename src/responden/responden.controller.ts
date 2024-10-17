import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
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

    @Get('/:id')
    @HttpCode(200)
    async getRespondenById(
        @Param('id', ParseIntPipe) respondenId: number,
        @Admin() admin: User,
    ): Promise<WebResponse<RespondenResponse>> {
        const result = await this.respondenService.findRespondenById(
            respondenId,
            admin,
        );

        return {
            data: result,
        };
    }
}
