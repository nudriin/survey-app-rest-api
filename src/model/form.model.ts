export class FormSaveRequest {
    name: string;
    description?: string;
}

export class FormUpdateRequest {
    id: number;
    content?: string;
    published?: boolean;
}

export class FormResponse {
    id: number;
    createdAt: Date;
    published: boolean;
    name: string;
    description: string;
    content: string;
    visit: number;
    submissions: number;
    shareURL?: string;
    userId: number;
}
