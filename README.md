# Playwright + TypeScript Automation Framework

Enterprise-grade test automation framework using Playwright, TypeScript, and Node.js.

## Setup

```bash
npm install
npx playwright install
```

No configuration needed for local development — `.env.dev` is loaded by default. To override locally:

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

### Allure reports

```bash
npm run allure:generate   # generate Allure report from results
npm run allure:open       # open Allure report in browser
```

Allure results are collected automatically on every test run. Generate the report to view.

### Switching environments

```bash
ENV=dev npm test       # dev environment (default)
ENV=qa npm test        # QA environment
ENV=staging npm test   # staging environment
ENV=prod npm test      # production environment
```

Each environment reads from `.env.<env>`. Local overrides go in `.env` (gitignored).

## Project Structure

```
├── config/
│   ├── env-manager.ts    Centralized environment loader
│   └── README.md
├── fixtures/
│   └── index.ts          Custom Playwright fixtures (setup/teardown)
├── helpers/
│   ├── api-client.ts     Typed HTTP client (GET/POST/PUT/DELETE)
│   ├── api-helper.ts     Legacy API helper (backward compat)
│   ├── header-manager.ts Auth and header management
│   └── response-validator.ts  Reusable response assertions
├── logs/                 Test run logs (gitignored)
├── pages/
│   ├── BasePage.ts       Core page object (nav, click, fill, waits)
│   ├── CartPage.ts       Cart page object
│   ├── InventoryPage.ts  Inventory page object
│   └── LoginPage.ts      Login page object
├── reporters/            Custom reporter implementations
├── tests/
│   ├── api/
│   │   └── users.spec.ts API tests (GET/POST/PUT/DELETE)
│   └── ui/
│       ├── inventory.spec.ts  Inventory + cart flow tests
│       └── login.spec.ts      Login tests
├── utils/
│   ├── api-utils.ts      Status codes and URL helpers
│   ├── env-config.ts     Environment config re-export
│   ├── logger.ts         Pino-based logging utility
│   ├── test-data.ts      Centralized test data
│   └── waits.ts          Standalone wait utilities
├── .env.dev              Dev environment config
├── .env.qa               QA environment config
├── .env.staging          Staging environment config
├── .env.example          Environment variable template
├── .gitignore
├── playwright.config.ts
├── tsconfig.json
└── eslint.config.mjs
```

## Page Object Model

Pages extend `BasePage` for common methods: navigate, click, fill, selectOption, hover, getText, getTexts, isVisible, isHidden, waitForElement, waitForUrl, takeScreenshot, and more.

```typescript
import { test, expect } from '../../fixtures';

test('login successfully', async ({ loginPage, page }) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});
```

### Available page objects

| Page            | Methods                                                                 |
|-----------------|-------------------------------------------------------------------------|
| `LoginPage`     | goto, login, getErrorMessage, isLoginButtonVisible                      |
| `InventoryPage` | goto, getItemCount, getItemNames, addItemToCart, removeItem, getCartCount, goToCart, sortBy |
| `CartPage`      | goto, getItemCount, getItemNames, removeItem, proceedToCheckout, continueShopping |

## API Testing

### ApiClient

The `apiClient` fixture provides a typed HTTP client with GET, POST, PUT, DELETE and query param support.

```typescript
import { test, expect } from '../../fixtures';

test('create a post', async ({ apiClient }) => {
  const response = await apiClient.post('/posts', {
    data: { title: 'foo', body: 'bar', userId: 1 },
  });
  expect(response.status()).toBe(201);
});
```

### Response Validator

```typescript
import { expectStatus, expectJson, expectToHaveKeys } from '../../helpers/response-validator';
import { HttpStatus } from '../../utils/api-utils';

const response = await apiClient.get('/posts/1');
await expectStatus(response, HttpStatus.OK);
await expectJson(response);
await expectToHaveKeys(response, ['id', 'title', 'body']);
```

### Header Manager

```typescript
apiClient.headerManager.setAuth('token123');
apiClient.headerManager.setApiKey('key-abc');
```

## Environment Configuration

Config is loaded by `config/env-manager.ts`. It resolves the active environment from the `ENV` variable and exports a typed config object.

| Variable       | Dev default                           | Description          |
|----------------|---------------------------------------|----------------------|
| `ENV`          | `dev`                                 | Active environment   |
| `BASE_URL`     | `https://www.saucedemo.com`           | UI test base URL     |
| `API_BASE_URL` | `https://jsonplaceholder.typicode.com`| API test base URL    |
| `TIMEOUT`      | `30000`                               | Default timeout (ms) |

Credentials are loaded from env files — never hardcoded in source.

### Available environments

| File            | Scope                        |
|-----------------|------------------------------|
| `.env.dev`      | Dev environment (default)    |
| `.env.qa`       | QA environment               |
| `.env.staging`  | Staging environment          |
| `.env`          | Local overrides (gitignored) |

## Fixtures

Custom fixtures in `fixtures/index.ts` handle setup and teardown automatically:

| Fixture         | Setup                                        | Teardown                      |
|-----------------|----------------------------------------------|-------------------------------|
| `loginPage`     | Navigate to SauceDemo login page             | Clear localStorage + cookies  |
| `inventoryPage` | Log in as standard_user, land on inventory   | —                             |
| `cartPage`      | Log in as standard_user, land on cart        | —                             |
| `apiHelper`     | Create ApiHelper instance                    | —                             |
| `apiClient`     | Create ApiClient with base URL from config   | —                             |

## Reporting

Reports are generated automatically on every test run.

| Report  | Output            | Setup                                  |
|---------|-------------------|----------------------------------------|
| HTML    | `playwright-report/` | Built-in, configured in `playwright.config.ts` |
| Allure  | `allure-results/` | Added via `allure-playwright` reporter |

Generate and view Allure:

```bash
npm run allure:generate
npm run allure:open
```

### Failure artifacts

| Artifact   | Condition        | Location          |
|------------|------------------|-------------------|
| Screenshot | On failure       | `test-results/`   |
| Trace      | First retry      | `test-results/`   |
| Video      | On failure       | `test-results/`   |

Configured in `playwright.config.ts` under `use`.

## Logging

A Pino-based logger writes to `logs/run-<timestamp>.log` for each test execution.

```typescript
import { logger } from '../utils/logger';

logger.info('test step started');
logger.error({ error }, 'request failed');
logger.debug({ responseStatus: 200 }, 'response received');
```

Set `LOG_LEVEL` to control verbosity (default: `info`):

```bash
LOG_LEVEL=debug npm test    # include debug logs
LOG_LEVEL=warn npm test     # warnings and errors only
```

The logger is reused across UI (BasePage) and API (ApiClient) layers. Navigations and API calls log at `info` level. Element actions (click, fill) log at `debug` level.

## Docker

The framework runs inside a Docker container using the official Playwright image (includes Chromium, Firefox, WebKit and all system dependencies).

Build and run all tests:

```bash
npm run docker:test
```

Run with a specific environment:

```bash
ENV=qa npm run docker:test
```

Open a bash shell inside the container:

```bash
npm run docker:bash
```

Output directories (`test-results/`, `playwright-report/`, `allure-results/`, `screenshots/`, `logs/`) are mounted from the container back to the host so results persist after the container exits.

### Docker structure

| File                | Purpose                                  |
|---------------------|------------------------------------------|
| `Dockerfile`        | Builds image from `mcr.microsoft.com/playwright`, installs deps, copies source |
| `docker-compose.yml`| Mounts output volumes, sets `ENV` and `CI` |
| `.dockerignore`     | Excludes `node_modules/`, logs, output directories from the build context |

## CI

Set `CI=true` to enable retries (2 per test) and reduce parallel workers.
