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
import { FormService } from './form.service';
import { WebResponse } from '../model/web.model';
import {
    FormResponse,
    FormSaveRequest,
    FormUpdateRequest,
} from '../model/form.model';
import { User } from '@prisma/client';
import { Admin } from '../common/admin.decorator';

@Controller('/api/v1/forms')
export class FormController {
    constructor(private formService: FormService) {}

    @Post()
    @HttpCode(200)
    async save(
        @Admin() user: User,
        @Body() request: FormSaveRequest,
    ): Promise<WebResponse<FormResponse>> {
        const result = await this.formService.saveForm(request, user);

        return {
            data: result,
        };
    }

    @Get()
    @HttpCode(200)
    async findAll(@Admin() user: User): Promise<WebResponse<FormResponse[]>> {
        const result = await this.formService.findAllForm(user);

        return {
            data: result,
        };
    }

    @Get('/:formId')
    @HttpCode(200)
    async findById(
        @Param('formId', ParseIntPipe) formId: number,
    ): Promise<WebResponse<FormResponse>> {
        const result = await this.formService.findByIdForm(formId);

        return {
            data: result,
        };
    }

    @Patch()
    @HttpCode(200)
    async update(
        @Admin() user: User,
        @Body() request: FormUpdateRequest,
    ): Promise<WebResponse<FormResponse>> {
        const result = await this.formService.updateForm(user, request);

        return {
            data: result,
        };
    }

    @Get('/url/:shareURL')
    @HttpCode(200)
    async findByUrl(
        @Param('shareURL') shareURL: string,
    ): Promise<WebResponse<FormResponse>> {
        const result = await this.formService.findByUrlForm(shareURL);

        return {
            data: result,
        };
    }
}
