class RegisterPage {
  constructor(page) {
    this.page = page;

    this.username = page.locator('input[placeholder="Username"]');
    this.email = page.locator('input[placeholder="Email"]');
    this.password = page.locator('input[placeholder="Password"]');

    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
  }

  async open() {
    await this.page.goto('/');
    await this.page.getByRole('link', { name: 'Sign up' }).click();
  }

  async register(user) {
    await this.username.fill(user.username);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.signUpButton.click();
  }
}

module.exports = { RegisterPage };