import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
    RespondenResponse,
    RespondenSaveRequest,
    RespondenUpdateRequest,
} from '../model/responden.model';
import { Gender, User } from '@prisma/client';
import { RespondenValidation } from './responden.validation';

@Injectable()
export class RespondenService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}

    async saveResponden(
        request: RespondenSaveRequest,
        user: User,
    ): Promise<RespondenResponse> {
        const validRequest: RespondenSaveRequest =
            this.validationService.validate(
                RespondenValidation.SAVE,
                request,
            ) as RespondenSaveRequest;

        const userCount = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (userCount == 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const responden = await this.prismaService.responden.create({
            data: {
                name: validRequest.name,
                email: validRequest.email,
                address: validRequest.address,
                phone: validRequest.phone,
                age: validRequest.age,
                education: validRequest.education,
                profession: validRequest.profession,
                service_type: validRequest.service_type,
                gender: validRequest.gender as Gender,
            },
        });

        return responden;
    }

    async findRespondenById(
        respondenId: number,
        user: User,
    ): Promise<RespondenResponse> {
        const validId = this.validationService.validate(
            RespondenValidation.FIND_ID,
            respondenId,
        );

        const userCount = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (userCount == 0) throw new HttpException('Unauthorized', 401);

        const responden = await this.prismaService.responden.findUnique({
            where: {
                id: validId,
            },
        });

        if (!responden) throw new HttpException('responden not found', 404);

        return responden;
    }

    async findAllResponden(user: User): Promise<RespondenResponse[]> {
        const userCount = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (userCount == 0) throw new HttpException('Unauthorized', 401);

        const respondens = await this.prismaService.responden.findMany();

        if (!respondens) throw new HttpException('responden not found', 404);

        return respondens;
    }

    async updateRespondenData(
        request: RespondenUpdateRequest,
        user: User,
    ): Promise<RespondenResponse> {
        const validRequest: RespondenUpdateRequest =
            this.validationService.validate(
                RespondenValidation.UPDATE,
                request,
            ) as RespondenUpdateRequest;

        const userCount = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (userCount == 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const responden = await this.prismaService.responden.findUnique({
            where: {
                id: validRequest.id,
            },
        });

        if (!responden) {
            throw new HttpException('responden not found', 404);
        }

        if (validRequest.name) responden.name = validRequest.name;
        if (validRequest.email) responden.email = validRequest.email;
        if (validRequest.address) responden.address = validRequest.address;
        if (validRequest.phone) responden.phone = validRequest.phone;
        if (validRequest.age) responden.age = validRequest.age;
        if (validRequest.education)
            responden.education = validRequest.education;
        if (validRequest.profession)
            responden.profession = validRequest.profession;
        if (validRequest.service_type)
            responden.service_type = validRequest.service_type;
        if (validRequest.gender)
            responden.gender = validRequest.gender as Gender;

        const updatedResponden = await this.prismaService.responden.update({
            where: {
                id: responden.id,
            },
            data: responden,
        });

        return updatedResponden;
    }

    async deleteRespondenById(
        respondenId: number,
        user: User,
    ): Promise<string> {
        const validId = this.validationService.validate(
            RespondenValidation.FIND_ID,
            respondenId,
        );

        const userCount = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (userCount == 0) {
            throw new HttpException('Unauthorized', 401);
        }

        const responden = await this.prismaService.responden.findUnique({
            where: {
                id: validId,
            },
        });

        if (!responden) {
            throw new HttpException('responden not found', 404);
        }

        await this.prismaService.responden.delete({
            where: {
                id: responden.id,
            },
        });

        return 'OK';
    }
}
