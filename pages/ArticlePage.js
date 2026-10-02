class ArticlePage {
  constructor(page) {
    this.page = page;

    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    this.title = page.locator('input[placeholder="Article Title"]');
    this.description = page.locator('input[placeholder="What\'s this article about?"]');
    this.body = page.locator('textarea[placeholder="Write your article (in markdown)"]');
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });

   this.editButton = page.getByRole('link', { name: /Edit Article/ }).first();
   this.deleteButton = page.getByRole('button', { name: /Delete Article/ }).first();
  }

  async openEditor() {
    await this.newArticleLink.click();
  }

  async createArticle(article) {
    await this.title.fill(article.title);
    await this.description.fill(article.description);
    await this.body.fill(article.body);
    await this.publishButton.click();
  }

  async editArticle(article) {
    await this.editButton.click();
    await this.title.fill(article.updatedTitle);
    await this.publishButton.click();
  }

  async deleteArticle() {
    await this.deleteButton.click();
  }
}

module.exports = { ArticlePage };