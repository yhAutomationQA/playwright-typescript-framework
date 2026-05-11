/**
 * ai-review.mjs — AI-powered PR review script
 *
 * This script is the AI provider fallback for the opencode-pr-review workflow.
 * It reads the skill definition, the prompt template, and the git diff,
 * then sends them to an AI API (OpenAI or Anthropic) for analysis.
 *
 * Usage:
 *   node .github/scripts/ai-review.mjs \
 *     --provider openai \
 *     --api-key sk-... \
 *     --model gpt-4o \
 *     --skill-file .ai/skills/playwright-pr-review.md \
 *     --prompt-file .ai/prompts/pr-review.prompt.md \
 *     --diff-file /tmp/pr-diff.txt
 *
 * Environment variables (alternative to CLI args):
 *   AI_REVIEW_PROVIDER, AI_REVIEW_API_KEY, AI_REVIEW_MODEL
 */

import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--provider':
        opts.provider = args[++i];
        break;
      case '--api-key':
        opts.apiKey = args[++i];
        break;
      case '--model':
        opts.model = args[++i];
        break;
      case '--skill-file':
        opts.skillFile = args[++i];
        break;
      case '--prompt-file':
        opts.promptFile = args[++i];
        break;
      case '--diff-file':
        opts.diffFile = args[++i];
        break;
      default:
        // skip
    }
  }

  // Resolve with environment variable fallbacks
  opts.provider = opts.provider || process.env.AI_REVIEW_PROVIDER || 'openai';
  opts.apiKey = opts.apiKey || process.env.AI_REVIEW_API_KEY || '';
  opts.model = opts.model || process.env.AI_REVIEW_MODEL || 'gpt-4o';

  return opts;
}

// ---------------------------------------------------------------------------
// File reading helpers
// ---------------------------------------------------------------------------
function readFileOrExit(filePath, label) {
  const resolved = path.resolve(filePath);
  try {
    return fs.readFileSync(resolved, 'utf-8');
  } catch (err) {
    console.error(`Error reading ${label} at ${resolved}: ${err.message}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Prompt builder — injects the diff into the prompt template
// ---------------------------------------------------------------------------
function buildPrompt(skillContent, promptTemplate, diffContent) {
  // Prepend the skill rules to the prompt so the AI has full context
  const systemPrompt = `You are a Senior QA Automation Architect. Follow these rules:\n\n${skillContent}`;

  // Inject the diff into the prompt template
  const userPrompt = promptTemplate.replace('{{GIT_DIFF}}', diffContent);

  return { systemPrompt, userPrompt };
}

// ---------------------------------------------------------------------------
// AI API callers
// ---------------------------------------------------------------------------
async function callOpenAI(apiKey, model, systemPrompt, userPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,       // low temperature for consistent, deterministic review
      max_tokens: 4096,       // enough for a detailed review
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(apiKey, model, systemPrompt, userPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const opts = parseArgs();

  // Validate required inputs
  if (!opts.diffFile || !opts.promptFile || !opts.skillFile) {
    console.error(
      'Usage: node ai-review.mjs --provider <provider> --api-key <key> --model <model> ' +
      '--skill-file <path> --prompt-file <path> --diff-file <path>',
    );
    process.exit(1);
  }

  // Verify the diff actually has content
  const diffContent = readFileOrExit(opts.diffFile, 'diff file');
  if (!diffContent.trim() || diffContent.trim() === '(no diff — no Playwright/TypeScript files changed)') {
    console.log('## AI PR Review');
    console.log('');
    console.log('**No issues found.** No Playwright/TypeScript code changes detected in this diff.');
    console.log('');
    console.log('## PR Quality Score: 100/100 — Excellent');
    console.log('');
    console.log('| Severity | Count |');
    console.log('|----------|-------|');
    console.log('| Critical | 0 |');
    console.log('| Major | 0 |');
    console.log('| Minor | 0 |');
    console.log('| Suggestion | 0 |');
    return;
  }

  const skillContent = readFileOrExit(opts.skillFile, 'skill file');
  const promptTemplate = readFileOrExit(opts.promptFile, 'prompt template');

  const { systemPrompt, userPrompt } = buildPrompt(skillContent, promptTemplate, diffContent);

  if (!opts.apiKey) {
    console.error('Error: No API key provided. Set AI_REVIEW_API_KEY environment variable or pass --api-key.');
    process.exit(1);
  }

  // Call the appropriate AI provider
  let reviewText;
  switch (opts.provider) {
    case 'openai':
      reviewText = await callOpenAI(opts.apiKey, opts.model, systemPrompt, userPrompt);
      break;
    case 'anthropic':
      reviewText = await callAnthropic(opts.apiKey, opts.model, systemPrompt, userPrompt);
      break;
    default:
      console.error(`Unsupported provider: ${opts.provider}. Use 'openai' or 'anthropic'.`);
      process.exit(1);
  }

  // Print the review to stdout (captured by the workflow)
  console.log(reviewText);
}

main().catch((err) => {
  console.error('AI review script failed:', err.message);
  // Output a fallback review so the workflow doesn't break
  console.log('## AI PR Review');
  console.log('');
  console.log('**Review could not be completed.**');
  console.log('');
  console.log(`Error: ${err.message}`);
  console.log('');
  console.log('## PR Quality Score: N/A');
  process.exit(1);
});
