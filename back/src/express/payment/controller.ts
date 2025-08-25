import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { PaymentManager } from './manager';
import { createOneRequestSchema } from './validations';

export class PaymentController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await PaymentManager.createOne(req.body));
    };
}
