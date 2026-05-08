# Playwright + TypeScript Automation Framework

Enterprise-grade test automation framework using Playwright, TypeScript, and Node.js.

## Prerequisites

- Node.js >= 18
- npm

## Setup

```bash
npm install
npx playwright install
```

Copy `.env.example` to `.env` and update values as needed:

```bash
cp .env.example .env
```

## Running Tests

```bash
npm test              # all tests, all browsers (headless)
npm run test:ui       # UI tests only
npm run test:api      # API tests only
npm run test:headed   # all tests, headed mode
npm run lint          # ESLint
npm run format        # Prettier format
```

## Project Structure

```
├── api/               API client utilities
├── config/            Environment configs
├── fixtures/          Custom Playwright fixtures (setup/teardown)
├── helpers/           API helper classes
├── logs/              Test logs (gitignored)
├── pages/             Page Object Models (BasePage, LoginPage)
├── reporters/         Custom reporters
├── test-data/         Static test data files
├── tests/
│   ├── ui/            UI browser tests
│   └── api/           API tests
├── utils/             Shared utilities (env-config, waits, test-data)
├── playwright.config.ts
├── tsconfig.json
└── eslint.config.mjs
```

## Writing Tests

### UI tests with Page Object Model

Pages extend `BasePage` for common methods (navigate, click, fill, wait).

```typescript
import { test, expect } from '../../fixtures';

test('login successfully', async ({ loginPage }) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});
```

### API tests

Use the `apiHelper` fixture for typed HTTP helpers.

```typescript
import { test, expect } from '../../fixtures';

test('fetch posts', async ({ apiHelper }) => {
  const response = await apiHelper.get('/posts');
  expect(response.status()).toBe(200);
});
```

### Fixtures

Custom fixtures in `fixtures/index.ts` handle setup and teardown automatically:

- `loginPage` — navigates to SauceDemo before each test, clears state after
- `apiHelper` — creates an `ApiHelper` instance bound to the request context

## Configuration

| Variable       | Default                                | Description          |
|----------------|----------------------------------------|----------------------|
| `BASE_URL`     | `https://www.saucedemo.com`            | UI test base URL     |
| `API_BASE_URL` | `https://jsonplaceholder.typicode.com` | API test base URL    |
| `TIMEOUT`      | `30000`                                | Default timeout (ms) |

## CI

Set `CI=true` to enable retries (2 per test) and reduce parallel workers.
