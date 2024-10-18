import { z } from 'zod';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';

export class ResponsesValidation {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}
}
