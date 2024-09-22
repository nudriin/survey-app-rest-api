import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { FormService } from './form.service';
import { WebResponse } from '../model/web.model';
import { FormResponse, FormSaveRequest } from '../model/form.model';
import { AuthUser } from '../common/auth-user.decorator';
import { User } from '@prisma/client';

@Controller('/api/v1/forms')
export class FormController {
    constructor(private formService: FormService) {}

    @Post()
    @HttpCode(200)
    async save(
        @AuthUser() user: User,
        @Body() request: FormSaveRequest,
    ): Promise<WebResponse<FormResponse>> {
        const result = await this.formService.saveForm(request, user);

        return {
            data: result,
        };
    }
}
