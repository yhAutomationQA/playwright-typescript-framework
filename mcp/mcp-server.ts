import { createConnection } from '@playwright/mcp';
import { logger } from '../utils/logger';
import { loadMcpConfig, toMcpConfig } from './config';
import { McpSessionManager } from './session-manager';

export async function startMcpServer(launchOptions?: Record<string, unknown>): Promise<void> {
  const settings = loadMcpConfig();
  const mcpConfig = toMcpConfig(settings, launchOptions);
  const sessionManager = new McpSessionManager(settings);

  logger.info(
    { mode: settings.mode, browser: settings.browser, headless: settings.headless },
    'starting MCP server',
  );

  const server = await createConnection(mcpConfig, () => sessionManager.getOrCreateContext() as never);

  process.on('SIGINT', async () => {
    logger.info('shutting down MCP server');
    await sessionManager.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('shutting down MCP server');
    await sessionManager.close();
    process.exit(0);
  });

  await new Promise(() => {});
}

if (require.main === module) {
  startMcpServer().catch((err) => {
    logger.error({ err }, 'MCP server failed');
    process.exit(1);
  });
}
