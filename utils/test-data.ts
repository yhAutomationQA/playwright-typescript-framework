export const testData = {
  validUser: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedOutUser: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  invalidCredentials: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
  inventoryUrl: 'https://www.saucedemo.com/inventory.html',
};

export const apiTestData = {
  postsEndpoint: '/posts',
  singlePostEndpoint: '/posts/1',
  createPostPayload: {
    title: 'Test Post',
    body: 'This is a test post body.',
    userId: 1,
  },
};
