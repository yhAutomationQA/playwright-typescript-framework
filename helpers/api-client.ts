import { APIRequestContext, APIResponse } from '@playwright/test';
import { HeaderManager, HttpHeaders } from './header-manager';

export interface RequestOptions {
  headers?: HttpHeaders;
  params?: Record<string, string | number>;
  data?: Record<string, unknown>;
  timeout?: number;
}

export class ApiClient {
  private headers: HeaderManager;

  constructor(
    private request: APIRequestContext,
    private baseUrl: string,
    defaultHeaders?: HttpHeaders,
  ) {
    this.headers = new HeaderManager(defaultHeaders);
  }

  get headerManager(): HeaderManager {
    return this.headers;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    const url = `${this.baseUrl}${endpoint}`;
    if (!params) return url;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => searchParams.append(key, String(value)));
    return `${url}?${searchParams.toString()}`;
  }

  async get(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(this.buildUrl(endpoint, options?.params), {
      headers: this.headers.merge(options?.headers),
      timeout: options?.timeout,
    });
  }

  async post(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(this.buildUrl(endpoint, options?.params), {
      headers: this.headers.merge(options?.headers),
      data: options?.data,
      timeout: options?.timeout,
    });
  }

  async put(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(this.buildUrl(endpoint, options?.params), {
      headers: this.headers.merge(options?.headers),
      data: options?.data,
      timeout: options?.timeout,
    });
  }

  async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(this.buildUrl(endpoint, options?.params), {
      headers: this.headers.merge(options?.headers),
      timeout: options?.timeout,
    });
  }
}
