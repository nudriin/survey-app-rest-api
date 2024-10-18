import { QuestionResponse } from './question.model';
import { RespondenResponse } from './responden.model';

export class ResponsesResponse {
    id: number;
    question_id: number;
    responden_id: number;
    select_option: number;
    created_at: Date;
}

export class ResponsesDetailedResponse {
    question: QuestionResponse;
    responden: RespondenResponse;
    responses: ResponsesResponse;
}

export class ResponsesSaveRequest {
    question_id: number;
    responden_id: number;
    select_option: number;
}
