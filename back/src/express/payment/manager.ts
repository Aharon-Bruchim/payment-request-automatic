import { PaymentFormData } from './interface';

export class PaymentManager {
    static createOne = async (payment: PaymentFormData) => {
        console.log('Creating payment request:', payment);
    };
}
