import { FormDetails } from '@prisma/client';

export class FormSaveRequest {
    name: string;
    description?: string;
}

export class FormUpdateRequest {
    id: number;
    content?: string;
    published?: boolean;
}

export class FormDetailsRequest {
    shareURL: string;
    content?: string;
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

export class FormDetailsResponse {
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
    formDetails: FormDetails[];
}

export class FormTotalStatistics {
    totalVisit: number;
    totalSubmission: number;
    totalSubmissionThisMonth: number;
}

export class SubmissionDistributionByForm {
    form: string;
    count: number;
}

export class MonthlySubmissionCount {
    date: Date;
    count: number;
}
