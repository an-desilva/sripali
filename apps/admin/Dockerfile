FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/types ./packages/types
COPY packages/ui ./packages/ui
COPY apps/admin ./apps/admin

RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @sripalie/types build
RUN pnpm --filter @sripalie/ui build
RUN pnpm --filter @sripalie/admin build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml ./
COPY apps/admin/package.json ./apps/admin/package.json
COPY --from=builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder /app/apps/admin/public ./apps/admin/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/admin/node_modules ./apps/admin/node_modules

EXPOSE 3001
CMD ["pnpm", "--filter", "@sripalie/admin", "start"]