import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { PaymentManager } from './manager';
import { createOneRequestSchema } from './validations';

export class PaymentController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        try {
            const result = await PaymentManager.createOne(req.body);
            res.json(result);
        } catch (err: any) {
            console.error('❌ Error in createOne:', err); // לוג מלא לשרת
            res.status(400) // עדיף 400 בפיתוח כדי לראות מה קרה
                .json({ ok: false, error: err?.message || 'unknown error' });
        }
    };
}
