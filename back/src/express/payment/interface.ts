export interface PaymentFormData {
    amount: number;
    bank: string;
    branch: string;
    account: string;
    date: string;
    studentCount: number;
    sessionCount: number;
    comments?: string;
    clientName: string;
    clientEmail?: string;
}
