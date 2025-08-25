import { config } from './config';

const { origin } = config.cors;

const corsOptions = {
    origin: origin,
    credentials: true,
};

export default corsOptions;
