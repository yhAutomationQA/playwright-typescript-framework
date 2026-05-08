import { expect, APIResponse } from '@playwright/test';

export async function expectStatus(response: APIResponse, status: number): Promise<void> {
  expect(response.status()).toBe(status);
}

export async function expectJson(response: APIResponse): Promise<void> {
  expect(response.headers()['content-type']).toContain('application/json');
}

export async function expectToHaveKeys(response: APIResponse, keys: string[]): Promise<void> {
  const body = await response.json();
  for (const key of keys) {
    expect(body).toHaveProperty(key);
  }
}
