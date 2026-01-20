# syntax=docker/dockerfile:1

FROM node:24-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

FROM base AS runner
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]
