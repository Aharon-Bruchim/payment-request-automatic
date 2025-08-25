import mongoose from 'mongoose';
import { config } from '../../config';
import { PaymentDocument } from './interface';

const PaymentSchema = new mongoose.Schema<PaymentDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
    },
    {
        versionKey: false,
    },
);

export const PaymentModel = mongoose.model<PaymentDocument>(config.mongo.paymentCollectionName, PaymentSchema);
