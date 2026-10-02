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

Approximately 2–3 hours, including setup, implementation, debugging and CI configuration.

# Part 2 – GSP Scenario

## 1. Coverage first – journeys I would automate

I would prioritize automation based on business impact, permission/security risk, frequency of use, and the likelihood of regression.

The first 10 journeys I would automate are:

1. Login and role-based access for Admin, Staff and Agent.
2. Create a new student/application and verify the initial state.
3. Move an application through the critical stages of the 15-stage pipeline.
4. Validate the document checklist for a destination market.
5. Verify that required and optional documents are handled correctly.
6. Verify that an Agent can access only their own students.
7. Verify that Staff can access the students and application data allowed by their permissions.
8. Verify Admin changes to country document checklists.
9. Validate important transitions around offer, CAS/visa and enrolment.
10. Negative scenarios such as missing documents, invalid data and unauthorized access.

I would automate the core application journey and permission checks first because failures in these areas can directly affect the recruitment and enrolment workflow.

## 2. Provably safe permissions

I would test permissions at both the UI and API levels. The API should be treated as the final security boundary because hiding a button in the UI does not prove that the resource is protected.

A basic permission matrix would be:

| Role | Own students | Other Agent's students | Admin configuration |
|------|--------------|------------------------|---------------------|
| Admin | View/Edit | View/Edit | View/Edit |
| Staff | View/Edit according to permission | View/Edit according to permission | No access unless permitted |
| Agent | View/Edit own students | Denied | Denied |

For each protected operation, I would test both positive and negative scenarios.

For example:
- Agent A can view and update their own student.
- Agent A cannot view or update Agent B's student.
- Agent A cannot access Admin configuration APIs.
- Staff and Admin receive only the permissions assigned to their roles.

I would also make direct API requests using another user's ID/token to verify that authorization is enforced by the backend and not only by the UI.

## 3. Friday configuration change

If an Admin changes Canada's document checklist on Friday evening, the change could affect new applications, existing applications that are still incomplete, document validation and later application stages.

The main risks I would check are:

- Required documents becoming incorrectly optional or mandatory.
- Existing applications receiving an unexpected checklist.
- Applications being blocked from progressing because of incorrect document validation.
- Agents or Staff seeing incorrect document requirements.
- Other destination markets being affected by an unintended configuration change.
- API responses not matching the updated configuration.

I would run targeted regression tests for Canada first, covering new and existing applications and document validation. I would then run a broader smoke/regression suite across other markets to detect unintended side effects.

The configuration change should go through CI so that the relevant automated tests run before the change reaches production.

## 4. Stability – keeping the suite fast and non-flaky

My main approach would be:

- Create test data through APIs instead of preparing data through the UI.
- Generate unique test data for each test run.
- Keep tests independent so one failed test does not affect another.
- Avoid hard-coded sleeps.
- Use Playwright locators and assertions for automatic waiting.
- Keep UI tests focused on important user journeys.
- Use API tests for setup and validations that do not require the UI.
- Use retries selectively for transient infrastructure problems, without hiding real product defects.
- Run independent tests in parallel where test-data isolation allows it.
- Use Playwright traces, screenshots and HTML reports in CI to investigate failures.

The overall goal would be to keep the suite small, reliable and focused on business-critical workflows rather than maximizing the number of tests.
