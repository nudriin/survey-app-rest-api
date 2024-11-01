import { z } from 'zod';

export class QuestionValidation {
    static readonly SAVE = z.object({
        question: z.string().min(1).max(225),
        acronim: z.string().min(1).max(225),
        option_1: z.string().min(1).max(225),
        option_2: z.string().min(1).max(225),
        option_3: z.string().min(1).max(225),
        option_4: z.string().min(1).max(225),
    });

    static readonly FIND_ID = z.number().min(1);

    static readonly UPDATE = z.object({
        id: z.number().min(1),
        question: z.string().min(1).max(225).optional(),
        acronim: z.string().min(1).max(225).optional(),
        option_1: z.string().min(1).max(225).optional(),
        option_2: z.string().min(1).max(225).optional(),
        option_3: z.string().min(1).max(225).optional(),
        option_4: z.string().min(1).max(225).optional(),
        status: z.boolean().optional(),
    });
}
