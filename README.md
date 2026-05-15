# Playwright + TypeScript Automation Framework

Test automation framework using Playwright, TypeScript, and Node.js. Features POM architecture, multi-environment config, API client, Allure reporting, Docker execution, and CI/CD (Jenkins + GitHub Actions).

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
│   └── env-manager.ts    Centralized environment loader
├── fixtures/
│   └── index.ts          Custom Playwright fixtures (setup/teardown)
├── helpers/
│   ├── api-client.ts     Typed HTTP client (GET/POST/PUT/DELETE) + HttpStatus constants
├── logs/                 Test run logs (gitignored)
├── pages/
│   ├── BasePage.ts       Core page object (nav, click, fill, waits)
│   ├── CartPage.ts       Cart page object
│   ├── InventoryPage.ts  Inventory page object
│   └── LoginPage.ts      Login page object
├── tests/
│   ├── api/
│   │   └── posts.spec.ts API tests (GET/POST/PUT/DELETE)
│   └── ui/
│       ├── inventory.spec.ts  Inventory + cart flow tests
│       └── login.spec.ts      Login tests
├── utils/
│   ├── logger.ts         Pino-based logging utility
│   └── test-data.ts      Centralized test data
├── .env.dev              Dev environment config
├── .env.qa               QA environment config
├── .env.staging          Staging environment config
├── .env.example          Environment variable template
├── .gitignore
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
└── sonar-project.properties
```

## Page Object Model

Pages extend `BasePage` for common methods: navigate, click, fill, selectOption, getText, getTexts, getAttribute, getCount, isVisible, isHidden, waitForUrl.

```typescript
import { test, expect } from '../fixtures';

test('login successfully', async ({ loginPage, page }) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});
```

Playwright's built-in auto-waiting handles element visibility and stability — no explicit waitForElement calls needed before actions.

### Available page objects

| Page            | Methods                                                                 |
|-----------------|-------------------------------------------------------------------------|
| `LoginPage`     | goto, login, getErrorMessage, isLoginButtonVisible                      |
| `InventoryPage` | goto, getItemCount, getItemNames, addItemToCart, removeItem, getCartCount, goToCart, sortBy |
| `CartPage`      | goto, getItemCount, getItemNames, removeItem, proceedToCheckout, continueShopping |

## API Testing

The `apiClient` fixture provides a typed HTTP client with GET, POST, PUT, DELETE, query param support, and timeout configuration.

```typescript
import { test, expect } from '../fixtures';
import { HttpStatus } from '../helpers/api-client';

test('create a post', async ({ apiClient }) => {
  const response = await apiClient.post('/posts', {
    data: { title: 'foo', body: 'bar', userId: 1 },
  });
  expect(response.status()).toBe(HttpStatus.CREATED);
});
```

### HttpStatus constants

```typescript
import { HttpStatus } from '../helpers/api-client';

expect(response.status()).toBe(HttpStatus.OK);       // 200
expect(response.status()).toBe(HttpStatus.CREATED);   // 201
expect(response.status()).toBe(HttpStatus.NOT_FOUND); // 404
```

### Custom headers

```typescript
apiClient.setHeader('Authorization', 'Bearer token123');
apiClient.removeHeader('x-api-key');
```

## Environment Configuration

Config is loaded by `config/env-manager.ts`. It resolves the active environment from the `ENV` variable and exports a typed config object.

| Variable       | Default                                | Description          |
|----------------|----------------------------------------|----------------------|
| `ENV`          | `dev`                                  | Active environment   |
| `BASE_URL`     | `https://www.saucedemo.com`            | UI test base URL     |
| `API_BASE_URL` | `https://jsonplaceholder.typicode.com` | API test base URL    |
| `TIMEOUT`      | `30000`                                | Default timeout (ms) |

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
| `Dockerfile`        | Builds image from `mcr.microsoft.com/playwright`, installs Allure CLI |
| `docker-compose.yml`| Mounts output volumes, sets `ENV` and `CI` |
| `.dockerignore`     | Excludes `node_modules/`, logs, output directories from the build context |

## CI/CD

### GitHub Actions

The `.github/workflows/ci.yml` pipeline runs on every push/PR:

1. **lint** — ESLint check
2. **snyk** — Dependency vulnerability scan (gated on `SNYK_TOKEN` secret)
3. **test** — Matrix across chromium, firefox, webkit (with Playwright browser caching)

Browser binaries are cached and system dependencies are installed fresh each run.

### Jenkins

The `Jenkinsfile` runs a full pipeline inside Docker:

1. Build Docker image
2. Install dependencies (`npm ci`)
3. Lint
4. Snyk security scan (gated on `SNYK_TOKEN` env var)
5. Execute tests (smoke or regression via parameter)
6. Generate Allure report
7. Archive artifacts (reports, screenshots, logs)

### SonarCloud

Code quality analysis runs automatically via SonarCloud auto-analysis (configured in `sonar-project.properties`). Quality gate results are posted to PRs.

## Security

- **Snyk** — Dependency vulnerability scanning via `snyk test`. Run locally with `npm run snyk:test`.
- Secrets are never hardcoded — loaded from environment variables and `.env.*` files (gitignored).

## MCP Server (AI Integration)

The framework includes a [Model Context Protocol](https://modelcontextprotocol.io) server that exposes Playwright automation capabilities to AI assistants. This enables AI-driven browser automation, test generation, and debugging.

### What is MCP?

MCP (Model Context Protocol) is an open standard that lets AI assistants (Claude, GPT, etc.) interact with tools and data sources through a standardized interface. The Playwright MCP server exposes browser automation as tools the AI can call.

### Starting the MCP Server

```bash
# stdio mode (default — for AI assistant integration)
npm run mcp

# HTTP mode (for remote access or testing)
npm run mcp:local

# Debug mode (headed browser, HTTP mode)
npm run mcp:debug
```

### Configuration

MCP is configured via environment variables:

| Variable            | Default          | Description                                |
|---------------------|------------------|--------------------------------------------|
| `MCP_MODE`          | `stdio`          | Transport mode: `stdio` or `http`          |
| `MCP_PORT`          | `3100`           | HTTP server port                           |
| `MCP_HOST`          | `localhost`      | HTTP server host                           |
| `MCP_HEADLESS`      | `true`           | Run browser headless                       |
| `MCP_BROWSER`       | `chromium`       | Browser: `chromium`, `firefox`, `webkit`   |
| `MCP_OUTPUT_DIR`    | `./mcp-output`   | Output directory for traces/screenshots    |
| `MCP_SAVE_SESSION`  | `false`          | Persist browser session to disk            |
| `MCP_CAPABILITIES`  | `core,network,storage,vision` | Enabled tool categories |

### Capabilities

| Capability | Tools Provided                                      |
|------------|-----------------------------------------------------|
| `core`     | Navigate, click, fill, select, hover, scroll, etc.  |
| `network`  | Inspect requests, responses, network logs           |
| `storage`  | Cookies, localStorage, sessionStorage management    |
| `vision`   | Coordinate-based interactions, screenshots          |
| `pdf`      | PDF generation from pages                           |
| `devtools` | Chrome DevTools Protocol access (chromium only)     |

### Example Workflows

Run the built-in examples:

```bash
npm run mcp:example:login   # AI-assisted login with snapshot capture
npm run mcp:example:locator # Locator inspection and debugging
npm run mcp:example:trace   # Trace collection for debugging
```

### How It Works

1. Start the MCP server: `npm run mcp`
2. Configure your AI assistant to connect to the MCP server (stdio or HTTP)
3. The AI can now control the browser, inspect pages, capture traces, and more
4. The server uses the same Playwright version and browser setup as the test framework

### Integration with Existing Framework

- Uses the standard framework's `playwright` (core) dependency
- MCP output directory (`mcp-output/`) is gitignored
- Compatible with Docker execution
- Does not interfere with test execution or existing CI/CD pipelines
- Reusable utilities (trace, screenshot, locator) are available as library modules

### Troubleshooting

| Issue                          | Solution                                      |
|--------------------------------|-----------------------------------------------|
| MCP server won't start         | Ensure `npm install` completed, check Node.js version |
| Browser not found              | Run `npx playwright install chromium`         |
| Port already in use            | Set `MCP_PORT` to a different port            |
| AI assistant not connecting    | Verify transport mode matches (stdio vs HTTP) |
| Headless mode not working      | Set `MCP_HEADLESS=false` for headed debugging |
