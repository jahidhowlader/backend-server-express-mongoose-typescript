import dotenv from 'dotenv';
import { IConfig } from '../types/error';

dotenv.config();

const config: IConfig = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL
};

export default config;