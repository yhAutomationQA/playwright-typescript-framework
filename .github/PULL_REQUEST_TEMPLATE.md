# Pull Request — Playwright TypeScript Framework

## Description

<!-- Provide a clear, concise description of the changes in this PR.
     Include the motivation for the change and how it improves the framework. -->

## Type of Change

<!-- Check all that apply. -->

- [ ] New test(s)
- [ ] Test fix / flakiness resolution
- [ ] Framework enhancement
- [ ] Bug fix (test or framework)
- [ ] Refactoring / code quality
- [ ] Documentation
- [ ] CI / DevOps
- [ ] Dependency update
- [ ] Other (describe below)

## Affected Areas

<!-- List the pages, components, or features affected by this change. -->

- 

## Test Evidence

<!-- Required for all non-documentation PRs. Provide evidence that the change works correctly. -->

- [ ] All existing tests pass locally: `npx playwright test`
- [ ] New tests pass: `npx playwright test <spec-file>`
- [ ] Tests pass across browsers: `npx playwright test --project=chromium --project=firefox --project=webkit`
- [ ] Trace/screenshot artifacts reviewed for correctness
- [ ] Verified against the target environment: `dev` / `qa` / `staging` / `prod`

## Self-Review Checklist

<!-- Confirm each item before requesting review. -->

### Flakiness Prevention
- [ ] No hardcoded waits (`page.waitForTimeout`) — used `waitForSelector`, `waitForURL`, or assertions
- [ ] No `.catch(() => {})` or silent error swallowing
- [ ] All Playwright actions have proper `await`
- [ ] Navigation actions are followed by URL assertions or element waits
- [ ] Locators use stable selectors (`data-test` attributes preferred)
- [ ] No dependency on test execution order

### Framework Compliance
- [ ] Tests use fixtures from `fixtures/index.ts` — no manual page object instantiation
- [ ] Page objects extend `BasePage` and define locators as `private readonly`
- [ ] No UI logic or assertions inside page objects
- [ ] Test data sourced from `utils/test-data.ts` or `config/env-manager.ts`
- [ ] No hardcoded URLs, credentials, or environment-specific values
- [ ] Follows existing coding conventions (naming, imports, formatting)

### Quality
- [ ] No `any` types — used specific types or `unknown` with narrowing
- [ ] No `as` casts that suppress type mismatches
- [ ] No duplicate code — reused existing page objects, fixtures, and helpers
- [ ] Linter passes: `npm run lint`
- [ ] TypeScript compiles: `npx tsc --noEmit`

## PR Quality Score (self-assessed)

<!-- Compute based on the checklist above. -->

| Severity   | Count |
|------------|-------|
| Blocking   | N     |
| Major      | N     |
| Minor      | N     |
| Clean      | N     |

---

> **Note:** Human approval is required before merge. This repository enforces branch protection rules — all checks must pass and a maintainer must approve.
