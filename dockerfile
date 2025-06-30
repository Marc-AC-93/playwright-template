FROM  mcr.microsoft.com/playwright:v1.53.0-jammy

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


RUN npm ci

COPY src/ ./src/
COPY playwright.config.ts ./
COPY tsconfig.json ./

RUN npx playwright install --with-deps chromium webkit

RUN npm install -g ts-node typescript

RUN tsc
