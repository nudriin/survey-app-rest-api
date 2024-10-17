import { z } from 'zod';

export class RespondenValidation {
    static readonly SAVE = z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().min(1).max(255),
        address: z.string().min(1).max(255),
        phone: z.string().min(1).max(20),
        age: z.number().min(1),
        education: z.string().min(1).max(255),
        profession: z.string().min(1).max(255),
        service_type: z.string().min(1).max(255),
        gender: z.string().min(1).max(255),
    });
}
