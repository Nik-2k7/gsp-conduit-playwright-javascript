const { test, expect } = require('../fixtures/test');
const { RegisterPage } = require('../pages/RegisterPage');
const { LoginPage } = require('../pages/LoginPage');
const { createUserData } = require('../utils/testData');

// Requirement 1: Sign-up journey
// This test intentionally creates the account through the UI.
test('user can sign up', async ({ page }) => {
  const user = createUserData();
  const registerPage = new RegisterPage(page);

  await registerPage.open();
  await registerPage.register(user);

  await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
  await expect(page.getByText(user.username, { exact: true })).toBeVisible();
});

// Requirement 1: Sign-in journey
// User is created through API so the UI test can focus on sign-in.
test('registered user can sign in', async ({ page, apiUser }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.signIn(apiUser.email, apiUser.password);

  await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
  await expect(page.getByText(apiUser.username, { exact: true })).toBeVisible();
});
