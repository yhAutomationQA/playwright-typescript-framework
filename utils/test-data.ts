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
  cartUrl: 'https://www.saucedemo.com/cart.html',
  inventoryItem: {
    name: 'Sauce Labs Backpack',
    price: '$29.99',
  },
};

export const apiTestData = {
  postsEndpoint: '/posts',
  singlePostEndpoint: '/posts/1',
  createPostPayload: {
    title: 'Test Post',
    body: 'This is a test post body.',
    userId: 1,
  },
  updatePostPayload: {
    id: 1,
    title: 'Updated Post',
    body: 'This is an updated post body.',
    userId: 1,
  },
};
