# GSP QA Engineer Assessment – Part 1

Playwright + JavaScript automation suite for the Conduit Angular SPA.

## Scope

This suite covers the requested Part 1 requirements:

1. End-to-end sign-up and sign-in journeys.
2. Full article lifecycle: create → edit → verify → delete.
3. Authorization test proving User A cannot edit or delete User B's article.
4. REST API test covering user registration and article CRUD with status/payload assertions.
5. API-based test-data setup for independent/repeatable tests.
6. Page Objects and a shared API-user fixture.
7. GitHub Actions execution on push/PR with Playwright HTML report as an artifact.

## Tech stack

- JavaScript
- Playwright Test
- Chromium
- GitHub Actions

## Run locally

```bash
npm install
npx playwright install chromium
npm test
```

Run headed:

```bash
npm run test:headed
```

Run in debug mode:

```bash
npm run test:debug
```

Open the HTML report:

```bash
npm run report
```

The application and API URLs can be overridden:

```bash
BASE_URL=https://conduit.bondaracademy.com API_URL=https://conduit-api.bondaracademy.com npm test
```

The default API is the separate Conduit API host used by the Bondar Academy demo.

## Test organisation

```text
pages/
  LoginPage.js
  RegisterPage.js
  ArticlePage.js

fixtures/
  test.js

tests/
  auth.spec.js
  article.spec.js
  api.spec.js
  permission.spec.js

utils/
  api.js
  testData.js

.github/workflows/
  playwright.yml
```

### Page Objects

Page Objects contain the locators and common UI actions for login, registration and article editing. This keeps the tests readable and makes locator maintenance easier if the UI changes.

### Shared fixture

`fixtures/test.js` creates a unique user through the REST API before tests that need an authenticated user. This avoids using the UI to prepare state and keeps UI tests focused on the user journey.

## Test-data strategy

Test data is generated with a timestamp/random value so users and article titles are unique across repeated runs.

Where the requirement is to test the UI journey itself (sign-up), the account is created through the UI. For other UI tests, the user is registered through the API first and then signs in through the UI.

The API test creates its own user and article. No test depends on data created by another test.

No hard-coded sleeps are used. Playwright's locator actions and assertions provide the required waiting behavior.

## Permission approach

The permission test creates User B and an article owned by User B through the API. It then authenticates as User A and attempts to update and delete User B's article through the API.

Expected result:

- Update returns HTTP 403.
- Delete returns HTTP 403.
- A follow-up GET confirms the original article still exists and its title is unchanged.

This tests authorization at the API boundary rather than relying only on the UI hiding Edit/Delete controls.

## CI

GitHub Actions runs the suite on every push and pull request. The workflow installs Node.js, dependencies and Chromium, executes the tests, and uploads the Playwright HTML report as a build artifact.

## Known limitations

- The suite currently runs against Chromium only because the assignment is time-boxed.
- The assessment environment is a public hosted application, so availability/network latency can affect execution.
- The suite does not currently validate every article-listing, comments, favorites, profile or settings workflow because they are outside the requested Part 1 scope.
- API authorization behavior is asserted using the expected HTTP 403 response from the application.

## What I would add with one more day

1. Add Firefox/WebKit coverage and a smoke/regression project split.
2. Add UI-level permission assertions that Edit/Delete controls are not available to another user.
3. Add more negative API cases and validation/error-response assertions.
4. Improve cleanup for any data that survives a failed test.
5. Add richer CI reporting and test annotations.
6. Add coverage for comments/favorites and selected critical navigation flows.

## Time spent

This solution intentionally focuses on a small, reliable suite rather than maximizing test count, in line with the assessment's time-boxed approach.
