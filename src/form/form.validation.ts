import { z } from 'zod';

export class FormValidation {
    static readonly SAVE = z.object({
        name: z.string().min(2, {
            message: 'Nama minimal 2 karakter',
        }),
        description: z.string().optional(),
    });
}
