import dotenv from 'dotenv';
import path from 'path';

export type Environment = 'dev' | 'qa' | 'staging' | 'prod';

export interface EnvironmentConfig {
  env: Environment;
  baseUrl: string;
  apiBaseUrl: string;
  credentials: {
    username: string;
    password: string;
  };
  timeout: number;
  isCI: boolean;
}

const defaultBaseUrl = 'https://www.saucedemo.com';
const defaultApiBaseUrl = 'https://jsonplaceholder.typicode.com';

const validEnvs = ['dev', 'qa', 'staging', 'prod'];

function resolveEnv(): Environment {
  const raw = (process.env.ENV || 'dev').toLowerCase();
  return validEnvs.includes(raw) ? (raw as Environment) : 'dev';
}

function buildConfig(): EnvironmentConfig {
  const env = resolveEnv();
  const envFile = path.resolve(__dirname, '..', `.env.${env}`);
  const localFile = path.resolve(__dirname, '..', '.env');

  dotenv.config({ path: envFile });
  dotenv.config({ path: localFile });

  return {
    env,
    baseUrl: process.env.BASE_URL || defaultBaseUrl,
    apiBaseUrl: process.env.API_BASE_URL || defaultApiBaseUrl,
    credentials: {
      username: process.env.USERNAME || '',
      password: process.env.PASSWORD || '',
    },
    timeout: parseInt(process.env.TIMEOUT || '30000', 10),
    isCI: process.env.CI === 'true',
  };
}

export const config = buildConfig();
