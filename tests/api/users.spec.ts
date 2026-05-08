import { test, expect } from '../../fixtures';
import { apiTestData } from '../../utils/test-data';

test.describe('JSONPlaceholder Posts API', () => {
  test('should fetch list of posts', async ({ apiHelper }) => {
    const response = await apiHelper.get(apiTestData.postsEndpoint);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('should fetch single post', async ({ apiHelper }) => {
    const response = await apiHelper.get(apiTestData.singlePostEndpoint);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.title).toBeDefined();
  });

  test('should create a new post', async ({ apiHelper }) => {
    const response = await apiHelper.post(apiTestData.postsEndpoint, apiTestData.createPostPayload);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(apiTestData.createPostPayload.title);
    expect(body.id).toBeDefined();
  });
});
