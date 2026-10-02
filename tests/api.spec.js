const API_URL = process.env.API_URL || 'https://conduit-api.bondaracademy.com';
const { test, expect } = require('../fixtures/test');
const { createUserData, createArticleData } = require('../utils/testData');

// Requirement 3: Complete article CRUD through REST API.
test('API can register user and complete article CRUD', async ({ request }) => {
  const userData = createUserData();
  const article = createArticleData();

  const registerResponse = await request.post(`${API_URL}/api/users`, {
    data: { user: userData }
  });

  console.log('Register status:', registerResponse.status());

  const responseBody = await registerResponse.text();
  console.log('Register response:', responseBody);

  expect(registerResponse.status()).toBe(201);

  const registerBody = JSON.parse(responseBody);

  expect(registerBody.user.username).toBe(userData.username);
  expect(registerBody.user.email).toBe(userData.email);

  const token = registerBody.user.token;

  const createResponse = await request.post(`${API_URL}/api/articles`, {
    headers: { Authorization: `Token ${token}` },
    data: { article }
  });
  expect(createResponse.status()).toBe(201);

  const createBody = await createResponse.json();
  expect(createBody.article.title).toBe(article.title);
  const slug = createBody.article.slug;

  const getResponse = await request.get(`${API_URL}/api/articles/${slug}`);
  expect(getResponse.status()).toBe(200);
  const getBody = await getResponse.json();
  expect(getBody.article.title).toBe(article.title);

  const updateResponse = await request.put(`${API_URL}/api/articles/${slug}`, {
    headers: { Authorization: `Token ${token}` },
    data: {
      article: {
        title: article.updatedTitle,
        description: article.description,
        body: article.body,
        tagList: []
      }
    }
  });
  expect(updateResponse.status()).toBe(200);

  const updateBody = await updateResponse.json();
  expect(updateBody.article.title).toBe(article.updatedTitle);

  const deleteResponse = await request.delete(`${API_URL}/api/articles/${updateBody.article.slug}`, {
    headers: { Authorization: `Token ${token}` }
  });
  expect(deleteResponse.status()).toBe(204);

  const verifyDeleteResponse = await request.get(`${API_URL}/api/articles/${updateBody.article.slug}`);
  expect(verifyDeleteResponse.status()).toBe(404);
});
