import path from 'path';
import type { createConnection } from '@playwright/mcp';
import { config as envConfig } from '../config/env-manager';

export type McpMode = 'stdio' | 'http';

export interface McpSettings {
  mode: McpMode;
  port: number;
  host: string;
  headless: boolean;
  browser: 'chromium' | 'firefox' | 'webkit';
  outputDir: string;
  saveSession: boolean;
  capabilities: string[];
}

type McpConfig = NonNullable<Parameters<typeof createConnection>[0]>;
type ToolCapability = NonNullable<McpConfig['capabilities']>[number];

export function loadMcpConfig(): McpSettings {
  return {
    mode: (process.env.MCP_MODE as McpMode) || 'stdio',
    port: parseInt(process.env.MCP_PORT || '3100', 10),
    host: process.env.MCP_HOST || 'localhost',
    headless: process.env.MCP_HEADLESS !== 'false',
    browser: (process.env.MCP_BROWSER as McpSettings['browser']) || 'chromium',
    outputDir: path.resolve(process.env.MCP_OUTPUT_DIR || './mcp-output'),
    saveSession: process.env.MCP_SAVE_SESSION === 'true',
    capabilities: (process.env.MCP_CAPABILITIES || 'core,network,storage,vision').split(','),
  };
}

export function toMcpConfig(settings: McpSettings, launchOptions?: Record<string, unknown>): McpConfig {
  const cfg: McpConfig = {
    browser: {
      browserName: settings.browser,
      launchOptions: {
        headless: settings.headless,
        ...launchOptions,
      },
      contextOptions: {
        viewport: { width: 1280, height: 720 },
        baseURL: envConfig.baseUrl,
      },
    },
    outputDir: settings.outputDir,
    saveSession: settings.saveSession,
  };

  if (settings.mode === 'http') {
    cfg.server = {
      port: settings.port,
      host: settings.host,
    };
  }

  if (settings.capabilities.length > 0) {
    cfg.capabilities = settings.capabilities as ToolCapability[];
  }

  return cfg;
}
