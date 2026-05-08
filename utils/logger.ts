import pino from 'pino';
import path from 'path';
import fs from 'fs';

const logDir = path.resolve(__dirname, '../logs');
fs.mkdirSync(logDir, { recursive: true });

const logFile = path.join(logDir, `run-${Date.now()}.log`);

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino/file',
    options: { destination: logFile },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
