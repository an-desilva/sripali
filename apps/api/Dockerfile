FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/types ./packages/types
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @sripalie/types build
RUN pnpm --filter @sripalie/api build

FROM node:20-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml ./
COPY packages/types ./packages/types
COPY apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

RUN pnpm install --prod --frozen-lockfile=false

EXPOSE 5000
CMD ["node", "apps/api/dist/server.js"]
