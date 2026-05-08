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

const envDefaults: Record<Environment, { baseUrl: string; apiBaseUrl: string }> = {
  dev: {
    baseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
  },
  qa: {
    baseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
  },
  staging: {
    baseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
  },
  prod: {
    baseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
  },
};

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

  const defaults = envDefaults[env];

  return {
    env,
    baseUrl: process.env.BASE_URL || defaults.baseUrl,
    apiBaseUrl: process.env.API_BASE_URL || defaults.apiBaseUrl,
    credentials: {
      username: process.env.USERNAME || '',
      password: process.env.PASSWORD || '',
    },
    timeout: parseInt(process.env.TIMEOUT || '30000', 10),
    isCI: process.env.CI === 'true',
  };
}

export const config = buildConfig();
