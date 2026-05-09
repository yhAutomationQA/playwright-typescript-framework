FROM mcr.microsoft.com/playwright:v1.59.1-jammy

WORKDIR /app

RUN npm install -g allure-commandline

ENV CI=true
ENV MCP_MODE=stdio
ENV MCP_HEADLESS=true
ENV MCP_BROWSER=chromium
ENV MCP_OUTPUT_DIR=/app/mcp-output
