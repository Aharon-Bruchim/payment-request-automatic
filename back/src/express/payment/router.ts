import { Router } from 'express';
import multer from 'multer';
import { wrapController } from '../../utils/express/wrappers';
import { PaymentController } from './controller';
// import { createOneRequestSchema } from './validations';

export const paymentRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

paymentRouter.post('/', upload.single('pdfFile'), wrapController(PaymentController.createOne));
