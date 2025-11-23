export interface User {
    id: number;
    email: string;
    name: string;
    role: 'VENDOR' | 'EMPLOYEE';
}

export interface Stall {
    id: number;
    stall_code: string;
    size: string;
    is_reserved: boolean;
    price: number;
}

export interface Reservation {
    id: number;
    stall_id: number;
    stall_code: string;
    size: string;
    qr_code: string;
    price: number;
    created_at: string;
}