/* v8 ignore start */
export interface Payment {
    name: string;
    email: string;
}

export interface PaymentDocument extends Payment {
    _id: string;
}
