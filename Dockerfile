FROM mcr.microsoft.com/playwright:v1.59.1-jammy

WORKDIR /app

RUN npx playwright install --with-deps

ENV CI=true
