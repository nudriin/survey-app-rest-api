import { z } from 'zod';

export class FormValidation {
    static readonly SAVE = z.object({
        name: z.string().min(2, {
            message: 'Nama minimal 2 karakter',
        }),
        description: z.string().optional(),
    });

    static readonly FIND_ID = z.number().min(1);

    static readonly UPDATE = z.object({
        id: z.number().min(1),
        content: z.string().optional(),
        published: z.boolean().optional(),
        shareURL: z.string().min(1).optional(),
    });

    static readonly UPDATE_DETAILS = z.object({
        shareURL: z.string().min(1),
        content: z.string().optional(),
    });

    static readonly UPDATE_DETAILS_BY_ID = z.object({
        detailId: z.number().min(0),
        shareURL: z.string().min(1),
        content: z.string().optional(),
    });

    static readonly FIND_URL = z.string().min(1);
}
