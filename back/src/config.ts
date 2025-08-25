import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').required().asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').required().asString(),
        paymentCollectionName: env.get('PAYMENT_REQUESTS_AUTOMATIC').required().asString(),
    },
    cors: {
        origin: env.get('CORS_ORIGIN').required().asString(),
    },
};
