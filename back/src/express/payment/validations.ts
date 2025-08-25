import { z } from 'zod';

const requiredFields = z
    .object({
        amount: z.number().min(1, 'Amount must be at least 1'),
        bank: z.string().min(1, 'Bank is required'),
        branch: z.string().min(1, 'Branch is required'),
        account: z.string().min(1, 'Account is required'),
        date: z.string().min(1, 'Date is required'),
        studentCount: z.number().min(1, 'Student count must be at least 1'),
        sessionCount: z.number().min(1, 'Session count must be at least 1'),
        clientName: z.string().min(1, 'Client name is required'),
        clientEmail: z.string().email('Invalid email address'),
    })
    .required();

const optionalFields = z.object({
    comments: z.string().optional(),
});

// POST /api/payment
export const createOneRequestSchema = z.object({
    body: requiredFields.merge(optionalFields),
    query: z.object({}),
    params: z.object({}),
});
