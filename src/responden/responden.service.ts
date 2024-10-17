import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
    RespondenResponse,
    RespondenSaveRequest,
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
}
