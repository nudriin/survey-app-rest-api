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
import { RespondenService } from './responden.service';
import { Admin } from '../common/admin.decorator';
import { User } from '@prisma/client';
import {
    RespondenSaveRequest,
    RespondenResponse,
    RespondenUpdateRequest,
    RespondenCountResponseByGender,
} from '../model/responden.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/v1/skm/responden')
export class RespondenController {
    constructor(private respondenService: RespondenService) {}

    @Post()
    @HttpCode(200)
    async save(
        @Body() request: RespondenSaveRequest,
    ): Promise<WebResponse<RespondenResponse>> {
        const result = await this.respondenService.saveResponden(request);

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

    @Get()
    @HttpCode(200)
    async getAllResponden(
        @Admin() admin: User,
    ): Promise<WebResponse<RespondenResponse[]>> {
        const result = await this.respondenService.findAllResponden(admin);

        return {
            data: result,
        };
    }

    @Patch()
    @HttpCode(200)
    async updateResponden(
        @Body() request: RespondenUpdateRequest,
        @Admin() admin: User,
    ): Promise<WebResponse<RespondenResponse>> {
        const result = await this.respondenService.updateRespondenData(
            request,
            admin,
        );

        return {
            data: result,
        };
    }

    @Delete('/:id')
    @HttpCode(200)
    async deleteResponden(
        @Param('id', ParseIntPipe) respondenId: number,
        @Admin() admin: User,
    ): Promise<WebResponse<string>> {
        const result = await this.respondenService.deleteRespondenById(
            respondenId,
            admin,
        );

        return {
            data: result,
        };
    }

    @Get('/count/total')
    @HttpCode(200)
    async countAllResponden(): Promise<WebResponse<number>> {
        const result = await this.respondenService.countResponden();

        return {
            data: result,
        };
    }

    @Get('/count/total/gender')
    @HttpCode(200)
    async countAllRespondenGroupByGender(): Promise<
        WebResponse<RespondenCountResponseByGender[]>
    > {
        const result =
            await this.respondenService.countRespondenGroupByGender();

        return {
            data: result,
        };
    }
}
