import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { FeaturesController } from './controller';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getCountRequestSchema,
    updateOneRequestSchema,
} from './validations';

export const featuresRouter = Router();

featuresRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(FeaturesController.getByQuery));

featuresRouter.get('/count', validateRequest(getCountRequestSchema), wrapController(FeaturesController.getCount));

featuresRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(FeaturesController.getById));

featuresRouter.post('/', validateRequest(createOneRequestSchema), wrapController(FeaturesController.createOne));

featuresRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(FeaturesController.updateOne));

featuresRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(FeaturesController.deleteOne));
