class LoginPage {
  constructor(page) {
    this.page = page;

    this.email = page.locator('input[placeholder="Email"]');
    this.password = page.locator('input[placeholder="Password"]');

    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

  async open() {
    await this.page.goto('/');
    await this.page.getByRole('link', { name: 'Sign in' }).click();
  }

  async signIn(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
  }
}

module.exports = { LoginPage };