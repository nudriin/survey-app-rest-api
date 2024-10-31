import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { WebResponse } from '../model/web.model';
import {
    AdminRegisterRequest,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
} from '../model/user.model';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AuthUser } from '../common/auth-user.decorator';
import { SuperAdmin } from '../common/super-admin.decorator';

@Controller('/api/v1/users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @HttpCode(200)
    async register(
        @Body() request: UserRegisterRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.register(request);
        return {
            data: result,
        };
    }

    @Post('/login')
    @HttpCode(200)
    async login(
        @Body() request: UserLoginRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.login(request);

        return {
            data: result,
        };
    }

    @Get('/current')
    @HttpCode(200)
    async findCurrentUser(
        @AuthUser() user: User,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.findCurrent(user);

        return {
            data: result,
        };
    }

    @Post('/admin/add')
    @HttpCode(200)
    async adminAddUser(
        @SuperAdmin() superAdmin: User,
        @Body() request: AdminRegisterRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.adminAddUser(superAdmin, request);
        return {
            data: result,
        };
    }

    @Get()
    @HttpCode(200)
    async findAllUser(
        @SuperAdmin() superAdmin: User,
    ): Promise<WebResponse<UserResponse[]>> {
        const result = await this.userService.findAllUsers(superAdmin);

        return {
            data: result,
        };
    }
}
