import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';

@Injectable()
export class ResponsesService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}
}
