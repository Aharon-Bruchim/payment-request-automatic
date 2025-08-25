import { Router } from 'express';
import { paymentRouter } from './payment/router';

export const appRouter = Router();

appRouter.use('/api/payment', paymentRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
