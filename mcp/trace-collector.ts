import path from 'path';
import { BrowserContext } from 'playwright';
import { logger } from '../utils/logger';

export async function startTracing(context: BrowserContext, outputDir: string, name: string): Promise<void> {
  const traceDir = path.join(outputDir, 'traces');
  await context.tracing.start({
    name,
    screenshots: true,
    snapshots: true,
    sources: true,
  });
  logger.info({ name, traceDir }, 'trace started');
}

export async function stopTracing(context: BrowserContext, outputDir: string, name: string): Promise<string> {
  const tracePath = path.join(outputDir, 'traces', `${name}.zip`);
  await context.tracing.stop({ path: tracePath });
  logger.info({ tracePath }, 'trace saved');
  return tracePath;
}

export async function captureTrace(context: BrowserContext, outputDir: string, label: string): Promise<string> {
  await stopTracing(context, outputDir, label);
  await startTracing(context, outputDir, label);
  return path.join(outputDir, 'traces', `${label}.zip`);
}
