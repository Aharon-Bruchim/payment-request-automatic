import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';

const requiredFields = z
    .object({
        name: z.string(),
        email: z.string().email(),
    })
    .required();

// GET /api/payment
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
        })
        .merge(requiredFields.partial()),
    params: z.object({}),
});

// GET /api/payment/count
export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: requiredFields.partial(),
    params: z.object({}),
});

// GET /api/payment/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /api/payment
export const createOneRequestSchema = z.object({
    body: requiredFields,
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/payment/:id
export const updateOneRequestSchema = z.object({
    body: requiredFields.partial(),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// DELETE /api/payment/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
