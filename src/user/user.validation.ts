import { z } from 'zod';

export class UserValidation {
    static readonly REGISTER = z.object({
        email: z.string().email().min(1).max(225),
        password: z.string().min(1).max(225),
        name: z.string().min(1).max(225),
    });

    static readonly LOGIN = z.object({
        email: z.string().email().min(1).max(225),
        password: z.string().min(1).max(225),
    });

    static readonly ADMIN_REGISTER = z.object({
        email: z.string().email().min(1).max(225),
        password: z.string().min(1).max(225),
        name: z.string().min(1).max(225),
        role: z.string().min(1).max(225),
    });

    static readonly FIND_ID = z.number().min(1);
}
