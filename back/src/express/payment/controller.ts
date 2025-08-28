import { Request, Response } from 'express';
import { PaymentManager } from './manager';
// import { createOneRequestSchema } from './validations';

export class PaymentController {
    static createOne = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file?.buffer) {
                res.status(400).json({
                    ok: false,
                    error: 'PDF file is required',
                });
                return;
            }

            // המר strings למספרים ידנית
            const paymentData = {
                ...req.body,
                amount: Number(req.body.amount),
                studentCount: Number(req.body.studentCount),
                sessionCount: Number(req.body.sessionCount),
            };

            const result = await PaymentManager.createOne(paymentData, req.file.buffer);
            res.json(result);
        } catch (err: any) {
            console.error('❌ Error in createOne:', err);
            res.status(400).json({ ok: false, error: err?.message || 'unknown error' });
        }
    };
}
