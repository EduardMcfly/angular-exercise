import { Response } from '../response/index';
export interface Person {
    id?: number;
    name: string;
    identification: string;
    lastName: string;
    phone: string;
    email: string;
}

export interface ResponsePerson extends Response {
    data?: Person[];
}
