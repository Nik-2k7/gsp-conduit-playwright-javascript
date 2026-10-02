function createUserData() {
  const id = Date.now() + Math.floor(Math.random() * 10000);

  return {
    username: `user${id}`,
    email: `user${id}@example.com`,
    password: 'Test@12345'
  };
}

function createArticleData() {
  const id = Date.now() + Math.floor(Math.random() * 10000);

  return {
    title: `Playwright Test Article ${id}`,
    description: 'Article created by Playwright automation',
    body: 'This article was created as part of the GSP QA Engineer assessment.',
    updatedTitle: `Updated Playwright Article ${id}`
  };
}

module.exports = { createUserData, createArticleData };