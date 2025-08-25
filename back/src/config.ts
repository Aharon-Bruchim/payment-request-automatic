import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(8000).required().asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost/payment_requests_automatic').required().asString(),
        paymentCollectionName: env.get('PAYMENT_REQUESTS_AUTOMATIC').default('users').required().asString(),
    },
};
