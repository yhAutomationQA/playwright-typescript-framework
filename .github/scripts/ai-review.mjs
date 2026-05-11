/**
 * ai-review.mjs — AI-powered PR review script (OpenAI only)
 *
 * Reads the skill definition, the prompt template, and the git diff,
 * then sends them to OpenAI for analysis.
 *
 * Usage:
 *   OPENAI_API_KEY="sk-..." node .github/scripts/ai-review.mjs \
 *     --provider openai \
 *     --model gpt-4o \
 *     --skill-file .ai/skills/playwright-pr-review.md \
 *     --prompt-file .ai/prompts/pr-review.prompt.md \
 *     --diff-file /tmp/pr-diff.txt
 *
 * Environment variables:
 *   OPENAI_API_KEY  (required)
 *   AI_REVIEW_MODEL (optional, defaults to gpt-4o)
 */

import fs from 'node:fs';
import path from 'node:path';

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--provider': opts.provider = args[++i]; break;
      case '--model':    opts.model = args[++i]; break;
      case '--skill-file': opts.skillFile = args[++i]; break;
      case '--prompt-file': opts.promptFile = args[++i]; break;
      case '--diff-file': opts.diffFile = args[++i]; break;
    }
  }
  opts.apiKey = process.env.OPENAI_API_KEY || '';
  return opts;
}

function readFileOrExit(filePath, label) {
  try {
    return fs.readFileSync(path.resolve(filePath), 'utf-8');
  } catch (err) {
    console.error(`Error reading ${label} at ${filePath}: ${err.message}`);
    process.exit(1);
  }
}

function buildPrompt(skillContent, promptTemplate, diffContent) {
  const systemPrompt = `You are a Senior QA Automation Architect. Follow these rules:\n\n${skillContent}`;
  const userPrompt = promptTemplate.replace('{{GIT_DIFF}}', diffContent);
  return { systemPrompt, userPrompt };
}

async function callOpenAI(apiKey, model, systemPrompt, userPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function main() {
  const opts = parseArgs();

  if (!opts.diffFile || !opts.promptFile || !opts.skillFile) {
    console.error('Missing required arguments: --skill-file, --prompt-file, --diff-file');
    process.exit(1);
  }

  const diffContent = readFileOrExit(opts.diffFile, 'diff file');
  if (!diffContent.trim() || diffContent.trim() === '(no diff — no Playwright/TypeScript files changed)') {
    console.log('## AI PR Review\n\n**No issues found.** No Playwright/TypeScript code changes detected.\n\n## PR Quality Score: 100/100 — Excellent\n\n| Severity | Count |\n|----------|-------|\n| Critical | 0 |\n| Major | 0 |\n| Minor | 0 |\n| Suggestion | 0 |');
    return;
  }

  if (!opts.apiKey) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    process.exit(1);
  }

  const skillContent = readFileOrExit(opts.skillFile, 'skill file');
  const promptTemplate = readFileOrExit(opts.promptFile, 'prompt template');
  const { systemPrompt, userPrompt } = buildPrompt(skillContent, promptTemplate, diffContent);

  const reviewText = await callOpenAI(opts.apiKey, opts.model || 'gpt-4o', systemPrompt, userPrompt);
  console.log(reviewText);
}

main().catch((err) => {
  console.error('AI review failed:', err.message);
  console.log('## AI PR Review\n\n**Review could not be completed.**\n\nError: ' + err.message);
  process.exit(1);
});
