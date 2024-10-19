export interface ResponsesResponse {
    id: number;
    question_id: number;
    responden_id: number;
    select_option: number;
    created_at: Date;
    selectedOptionText?: string;
}

export class ResponsesSaveRequest {
    question_id: number;
    responden_id: number;
    select_option: number;
}
