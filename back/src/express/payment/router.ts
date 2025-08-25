import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { PaymentController } from './controller';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getCountRequestSchema,
    updateOneRequestSchema,
} from './validations';

export const paymentRouter = Router();

paymentRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(PaymentController.getByQuery));

paymentRouter.get('/count', validateRequest(getCountRequestSchema), wrapController(PaymentController.getCount));

paymentRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(PaymentController.getById));

paymentRouter.post('/', validateRequest(createOneRequestSchema), wrapController(PaymentController.createOne));

paymentRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(PaymentController.updateOne));

paymentRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(PaymentController.deleteOne));
