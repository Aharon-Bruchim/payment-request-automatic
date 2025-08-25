import { DocumentNotFoundError } from '../../utils/errors';
import { Payment, PaymentDocument } from './interface';
import { PaymentModel } from './model';

export class PaymentManager {
    static getByQuery = async (query: Partial<Payment>, step: number, limit?: number): Promise<PaymentDocument[]> => {
        return PaymentModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static getCount = async (query: Partial<Payment>): Promise<number> => {
        return PaymentModel.countDocuments(query).lean().exec();
    };

    static getById = async (paymentId: string): Promise<PaymentDocument> => {
        return PaymentModel.findById(paymentId).orFail(new DocumentNotFoundError(paymentId)).lean().exec();
    };

    static createOne = async (payment: Payment): Promise<PaymentDocument> => {
        return PaymentModel.create(payment);
    };

    static updateOne = async (paymentId: string, update: Partial<Payment>): Promise<PaymentDocument> => {
        return PaymentModel.findByIdAndUpdate(paymentId, update, { new: true }).orFail(new DocumentNotFoundError(paymentId)).lean().exec();
    };

    static deleteOne = async (paymentId: string): Promise<PaymentDocument> => {
        return PaymentModel.findByIdAndDelete(paymentId).orFail(new DocumentNotFoundError(paymentId)).lean().exec();
    };
}
