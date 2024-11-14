export class RespondenSaveRequest {
    name: string;
    email: string;
    address: string;
    phone: string;
    age: number;
    education: string;
    profession: string;
    service_type: string;
    suggestions?: string;
    gender: string;
}
export class RespondenUpdateRequest {
    id: number;
    name?: string;
    email?: string;
    address?: string;
    phone?: string;
    age?: number;
    education?: string;
    profession?: string;
    service_type?: string;
    suggestions?: string;
    gender?: string;
}

export class RespondenResponse {
    id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
    age: number;
    education: string;
    profession: string;
    service_type: string;
    suggestions?: string;
    gender: string;
}

export class RespondenCountResponseByGender {
    total: number;
    gender: string;
}
