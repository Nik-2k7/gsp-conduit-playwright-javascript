const API_URL = process.env.API_URL || 'https://conduit-api.bondaracademy.com';
const { test, expect } = require('../fixtures/test');
const { createUserData, createArticleData } = require('../utils/testData');
const { registerUser, loginUser, createArticle } = require('../utils/api');

// Requirement 2: User A must not be able to edit or delete User B's article.
// API-level checks are used because they verify authorization directly and avoid depending
// only on whether the UI happens to hide the buttons.
test('user A cannot edit or delete user B article', async ({ request, apiUser }) => {
  const userBData = createUserData();
  const userB = await registerUser(request, userBData);
  const article = createArticleData();
  const createdArticle = await createArticle(request, userB.token, article);
  const slug = createdArticle.article.slug;

  const userA = await loginUser(request, apiUser);

  const editResponse = await request.put(`${API_URL}/api/articles/${slug}`, {
    headers: { Authorization: `Token ${userA.token}` },
    data: {
      article: {
        title: 'Unauthorized update',
        description: article.description,
        body: article.body,
        tagList: []
      }
    }
  });
  expect(editResponse.status()).toBe(403);

  const deleteResponse = await request.delete(`${API_URL}/api/articles/${slug}`, {
    headers: { Authorization: `Token ${userA.token}` }
  });
  expect(deleteResponse.status()).toBe(403);

  const ownerCheck = await request.get(`${API_URL}/api/articles/${slug}`);
  expect(ownerCheck.status()).toBe(200);
  const ownerCheckBody = await ownerCheck.json();
  expect(ownerCheckBody.article.title).toBe(article.title);
});
