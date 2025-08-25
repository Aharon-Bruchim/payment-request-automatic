import { Request } from 'express';
import { AnyZodObject, z } from 'zod';
import { Prettify } from './types';

export type TypedRequest<T extends AnyZodObject> = Prettify<Request<z.infer<T>['params'], unknown, z.infer<T>['body'], z.infer<T>['query']>>;
