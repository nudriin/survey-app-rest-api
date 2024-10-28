import { QuestionResponse } from './question.model';

export interface ResponsesResponse {
    id: number;
    question_id: number;
    responden_id: number;
    select_option: number;
    created_at: Date;
    select_option_text: string;
}

export class ResponsesSaveRequest {
    question_id: number;
    responden_id: number;
    select_option: number;
}

export class ResponsesByUserResponse {
    id: number;
    question_id: number;
    responden_id: number;
    select_option: number;
    created_at: Date;
    select_option_text: string;
    question: QuestionResponse;
}
