FROM node:24-slim AS base

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY src ./src

COPY . .

RUN pnpm install
RUN pnpm run build

FROM node:24-slim

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY src ./src
RUN pnpm install
COPY --from=0 /usr/src/app/dist ./dist
EXPOSE 8080

RUN pnpm build

CMD pnpm start
