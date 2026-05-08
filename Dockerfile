FROM mcr.microsoft.com/playwright:v1.59.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx playwright install --with-deps chromium

ENV CI=true

CMD ["npx", "playwright", "test"]
