import { APIRequestContext } from '@playwright/test';
import { envConfig } from '../utils/env-config';

export class ApiHelper {
  private baseUrl: string;

  constructor(private request: APIRequestContext) {
    this.baseUrl = envConfig.apiBaseUrl;
  }

  async get(endpoint: string) {
    return this.request.get(`${this.baseUrl}${endpoint}`);
  }

  async post(endpoint: string, data: Record<string, unknown>) {
    return this.request.post(`${this.baseUrl}${endpoint}`, { data });
  }

  async put(endpoint: string, data: Record<string, unknown>) {
    return this.request.put(`${this.baseUrl}${endpoint}`, { data });
  }

  async delete(endpoint: string) {
    return this.request.delete(`${this.baseUrl}${endpoint}`);
  }
}
