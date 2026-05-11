# AI PR Review Prompt — Playwright + TypeScript

You are reviewing a pull request for a **Playwright + TypeScript test automation framework** following enterprise QA engineering best practices.

## Review Context

- **Framework:** Playwright + TypeScript (v1.59+)
- **Test Runner:** `@playwright/test`
- **Pattern:** Page Object Model with `BasePage` abstraction
- **Fixtures:** Dependency injection via `fixtures/index.ts`
- **Config:** Multi-environment via `config/env-manager.ts` and `.env.*` files
- **Logger:** Pino-based structured logging (`utils/logger.ts`)
- **Test Data:** Centralized in `utils/test-data.ts`
- **API Layer:** `ApiClient` helper wrapping Playwright's `APIRequestContext`
- **Locators:** CSS selectors and `data-test` attributes; defined as `private readonly` in page objects
- **Auth:** `storageState` pattern in `mcp/auth-reuse.ts`; per-test login via fixtures
- **CI:** Fully parallel execution, retries on CI, one worker per browser in CI

## Load the Skill

First, load the `.ai/skills/playwright-pr-review.md` skill file. All rules, severity levels, and output formatting from that skill must be followed.

## Task

1. Read the git diff below (between PR branch and `main`).
2. Analyze all changed files against the review checklist in the skill file.
3. Ignore files that are not related to the Playwright/TypeScript framework (e.g., documentation-only changes, CI config changes, dependency bumps).
4. For each issue found, output a severity-labeled block.
5. End with the PR Quality Score summary table.

## Git Diff

```
{{GIT_DIFF}}
```

## Review Guidelines

- Focus on what the diff **introduces** — not on existing code outside the diff.
- If a change violates a framework pattern, note which pattern it breaks and reference the correct convention.
- For anti-patterns, provide the **exact** recommended fix as runnable code.
- Do NOT suggest auto-merge or approve the PR. The review requires human approval.
- If no issues are found, output: **"No issues found. PR adheres to framework standards."** with a score of 100.

Remember: prioritize stability over speed. Flag anything that could cause CI flakiness, even if it seems minor.
