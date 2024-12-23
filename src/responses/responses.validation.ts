import { z } from 'zod';

export class ResponsesValidation {
    static readonly SAVE = z.object({
        question_id: z.number().min(1),
        responden_id: z.number().min(1),
        select_option: z.number().min(1),
    });

    static readonly FIND_ID = z.number().min(1);

    static readonly UPDATE = z.object({
        id: z.number().min(1),
        select_option: z.number().min(1),
    });
}
