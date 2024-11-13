import { z } from 'zod';

export class RespondenValidation {
    static readonly SAVE = z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().min(1).max(255).optional(),
        address: z.string().min(1).max(255).optional(),
        phone: z.string().min(1).max(20).optional(),
        age: z.number().min(1),
        education: z.string().min(1).max(255),
        profession: z.string().min(1).max(255),
        service_type: z.string().min(1).max(255),
        gender: z.string().min(1).max(255),
    });

    static readonly FIND_ID = z.number().min(1);

    static readonly UPDATE = z.object({
        id: z.number().min(1),
        name: z.string().min(1).max(225).optional(),
        email: z.string().email().min(1).max(225).optional(),
        address: z.string().min(1).max(225).optional(),
        phone: z.string().min(1).max(20).optional(),
        age: z.number().min(1).optional(),
        education: z.string().min(1).max(225).optional(),
        profession: z.string().min(1).max(225).optional(),
        service_type: z.string().min(1).max(225).optional(),
        gender: z.string().min(1).max(225).optional(),
    });
}
