import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const envConfig = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  username: process.env.USERNAME || 'standard_user',
  password: process.env.PASSWORD || 'secret_sauce',
  timeout: parseInt(process.env.TIMEOUT || '30000', 10),
  isCI: process.env.CI === 'true',
};
