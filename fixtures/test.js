const base = require('@playwright/test');
const { createUserData } = require('../utils/testData');
const { registerUser } = require('../utils/api');

const test = base.test.extend({
  apiUser: async ({ request }, use) => {
    const userData = createUserData();
    const user = await registerUser(request, userData);
    await use({ ...userData, ...user });
  }
});

module.exports = { test, expect: base.expect };
