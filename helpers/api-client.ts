import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '../utils/logger';

export type HttpHeaders = Record<string, string>;

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

const defaultHeaders: HttpHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export interface RequestOptions {
  headers?: HttpHeaders;
  params?: Record<string, string | number>;
  data?: Record<string, unknown>;
  timeout?: number;
}

export class ApiClient {
  private headers: HttpHeaders;

  constructor(
    private request: APIRequestContext,
    private baseUrl: string,
    extraHeaders?: HttpHeaders,
  ) {
    this.headers = { ...defaultHeaders, ...extraHeaders };
  }

  setHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  removeHeader(key: string): void {
    delete this.headers[key];
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    const url = `${this.baseUrl}${endpoint}`;
    if (!params) return url;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => searchParams.append(key, String(value)));
    return `${url}?${searchParams.toString()}`;
  }

  private logResponse(method: string, url: string, response: APIResponse): void {
    logger.info(
      { method, url, status: response.status(), statusText: response.statusText() },
      `${method} ${response.status()}`,
    );
  }

  async get(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    logger.debug({ method: 'GET', url }, 'api request');
    const response = await this.request.get(url, {
      headers: { ...this.headers, ...options?.headers },
      timeout: options?.timeout,
    });
    await this.logResponse('GET', url, response);
    return response;
  }

  async post(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    logger.debug({ method: 'POST', url }, 'api request');
    const response = await this.request.post(url, {
      headers: { ...this.headers, ...options?.headers },
      data: options?.data,
      timeout: options?.timeout,
    });
    await this.logResponse('POST', url, response);
    return response;
  }

  async put(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    logger.debug({ method: 'PUT', url }, 'api request');
    const response = await this.request.put(url, {
      headers: { ...this.headers, ...options?.headers },
      data: options?.data,
      timeout: options?.timeout,
    });
    await this.logResponse('PUT', url, response);
    return response;
  }

  async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    logger.debug({ method: 'DELETE', url }, 'api request');
    const response = await this.request.delete(url, {
      headers: { ...this.headers, ...options?.headers },
      timeout: options?.timeout,
    });
    await this.logResponse('DELETE', url, response);
    return response;
  }
}
