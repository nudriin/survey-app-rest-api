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
    FormDetailsRequest,
    FormDetailsResponse,
    FormResponse,
    FormSaveRequest,
    FormTotalStatistics,
    FormUpdateRequest,
    SubmissionDistributionByForm,
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
    ): Promise<WebResponse<FormDetailsResponse>> {
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

    @Patch('/url')
    @HttpCode(200)
    async updateDetails(
        @Body() request: FormDetailsRequest,
    ): Promise<WebResponse<FormDetailsResponse>> {
        const result = await this.formService.updateFormDetails(request);

        return {
            data: result,
        };
    }

    @Get('/all/statistics')
    @HttpCode(200)
    async findStatistics(
        @Admin() user: User,
    ): Promise<WebResponse<FormTotalStatistics>> {
        const result = await this.formService.findFormStatistics(user);

        return {
            data: result,
        };
    }

    @Get('/all/submission-distribution-form')
    @HttpCode(200)
    async findSubmissionDistribution(
        @Admin() user: User,
    ): Promise<WebResponse<SubmissionDistributionByForm[]>> {
        const result =
            await this.formService.findSubmissionDistributionByForm(user);

        return {
            data: result,
        };
    }
}
