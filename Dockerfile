FROM mcr.microsoft.com/playwright:v1.59.1-jammy

WORKDIR /app

RUN npm install -g allure-commandline

ENV CI=true
