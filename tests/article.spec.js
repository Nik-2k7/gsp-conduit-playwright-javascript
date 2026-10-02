const { test, expect } = require('../fixtures/test');
const { LoginPage } = require('../pages/LoginPage');
const { ArticlePage } = require('../pages/ArticlePage');
const { createArticleData } = require('../utils/testData');

// Requirement 1 + 4: Full article lifecycle.
// User state is created through the API, then the business journey is exercised through UI.
test('user can create, edit, verify and delete an article', async ({ page, apiUser }) => {
  const article = createArticleData();
  const loginPage = new LoginPage(page);
  const articlePage = new ArticlePage(page);

  await loginPage.open();
  await loginPage.signIn(apiUser.email, apiUser.password);

  await articlePage.openEditor();
  await articlePage.createArticle(article);

  await expect(page.getByRole('heading', { name: article.title })).toBeVisible();
  await expect(page.getByText(article.body, { exact: true })).toBeVisible();

  await articlePage.editArticle(article);

  await expect(page.getByRole('heading', { name: article.updatedTitle })).toBeVisible();

  await articlePage.deleteArticle();
 await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
  await expect(page.getByRole('heading', { name: article.updatedTitle })).not.toBeVisible();
});
