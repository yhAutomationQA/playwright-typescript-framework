import { test, expect } from '../../fixtures';
import { expectStatus, expectJson, expectToHaveKeys } from '../../helpers/response-validator';
import { HttpStatus } from '../../utils/api-utils';
import { apiTestData } from '../../utils/test-data';

test.describe('JSONPlaceholder API', () => {
  test('GET /posts - should return list of posts', async ({ apiClient }) => {
    const response = await apiClient.get(apiTestData.postsEndpoint);
    await expectStatus(response, HttpStatus.OK);
    await expectJson(response);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('title');
  });

  test('GET /posts/1 - should return single post', async ({ apiClient }) => {
    const response = await apiClient.get(apiTestData.singlePostEndpoint);
    await expectStatus(response, HttpStatus.OK);
    await expectToHaveKeys(response, ['id', 'title', 'body', 'userId']);

    const body = await response.json();
    expect(body.id).toBe(1);
  });

  test('POST /posts - should create a new post', async ({ apiClient }) => {
    const response = await apiClient.post(apiTestData.postsEndpoint, {
      data: apiTestData.createPostPayload,
    });
    await expectStatus(response, HttpStatus.CREATED);
    await expectToHaveKeys(response, ['id', 'title']);

    const body = await response.json();
    expect(body.title).toBe(apiTestData.createPostPayload.title);
  });

  test('PUT /posts/1 - should update a post', async ({ apiClient }) => {
    const response = await apiClient.put(apiTestData.singlePostEndpoint, {
      data: apiTestData.updatePostPayload,
    });
    await expectStatus(response, HttpStatus.OK);

    const body = await response.json();
    expect(body.title).toBe(apiTestData.updatePostPayload.title);
  });

  test('DELETE /posts/1 - should delete a post', async ({ apiClient }) => {
    const response = await apiClient.delete(apiTestData.singlePostEndpoint);
    await expectStatus(response, HttpStatus.OK);
  });

  test('GET /posts - should filter posts with query params', async ({ apiClient }) => {
    const response = await apiClient.get(apiTestData.postsEndpoint, {
      params: { userId: 1 },
    });
    await expectStatus(response, HttpStatus.OK);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    body.forEach((post: { userId: number }) => {
      expect(post.userId).toBe(1);
    });
  });
});
