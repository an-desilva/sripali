FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/types ./packages/types
COPY packages/ui ./packages/ui
COPY apps/web ./apps/web

RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @sripalie/types build
RUN pnpm --filter @sripalie/ui build
RUN pnpm --filter @sripalie/web build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "--filter", "@sripalie/web", "start"]
