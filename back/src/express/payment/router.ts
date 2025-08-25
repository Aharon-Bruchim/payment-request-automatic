import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { PaymentController } from './controller';
import { createOneRequestSchema } from './validations';

export const paymentRouter = Router();

paymentRouter.post('/', validateRequest(createOneRequestSchema), wrapController(PaymentController.createOne));
