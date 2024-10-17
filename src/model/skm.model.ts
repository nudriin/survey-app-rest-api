export interface QuestionSaveRequest {
    question: string;
    acronim: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
}

export interface QuestionResponse {
    id: number;
    question: string;
    acronim: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
    status: boolean;
}
