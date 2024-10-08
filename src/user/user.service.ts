import { HttpException, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRegisterRequest, UserResponse } from '../model/user.model';
import { UserValidation } from './user.validation';
import { UserLoginRequest } from '../model/user.model';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async register(request: UserRegisterRequest): Promise<UserResponse> {
        console.info(`Register new user ${JSON.stringify(request)}`);

        const validRequest: UserRegisterRequest =
            this.validationService.validate(
                UserValidation.REGISTER,
                request,
            ) as UserRegisterRequest;

        const totalUser = await this.prismaService.user.count({
            where: {
                email: validRequest.email,
            },
        });

        if (totalUser != 0) {
            throw new HttpException('user is exist', 400);
        }

        validRequest.password = await bcrypt.hash(validRequest.password, 10);

        const user = await this.prismaService.user.create({
            data: validRequest,
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }

    async login(request: UserLoginRequest): Promise<UserResponse> {
        const validRequest: UserLoginRequest = this.validationService.validate(
            UserValidation.LOGIN,
            request,
        ) as UserLoginRequest;

        const user = await this.prismaService.user.findFirst({
            where: {
                email: validRequest.email,
            },
        });

        if (!user) {
            throw new HttpException('email or password is wrong', 400);
        }

        const isPasswordValid = await bcrypt.compare(
            validRequest.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new HttpException('email or password is wrong', 400);
        }

        const token = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            {
                expiresIn: '1d',
                secret: this.configService.get('JWT_SECRET'),
            },
        );

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            token: token,
        };
    }

    async findCurrent(user: User): Promise<UserResponse> {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }
}
