const { expect } = require('@playwright/test');

const API_URL = process.env.API_URL || 'https://conduit-api.bondaracademy.com';

async function registerUser(request, user) {
  const response = await request.post(`${API_URL}/api/users`, {
    data: { user }
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.user.username).toBe(user.username);

  return body.user;
}

async function loginUser(request, user) {
  const response = await request.post(`${API_URL}/api/users/login`, {
    data: {
      user: {
        email: user.email,
        password: user.password
      }
    }
  });

  expect(response.status()).toBe(200);
  const body = await response.json();

  return body.user;
}

async function createArticle(request, token, article) {
  const response = await request.post(`${API_URL}/api/articles`, {
    headers: { Authorization: `Token ${token}` },
    data: { article }
  });

  expect(response.status()).toBe(201);
  return response.json();
}

module.exports = { registerUser, loginUser, createArticle };
