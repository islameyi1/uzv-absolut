FROM node:20-alpine AS base

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# ---- Build dependencies ----
FROM base AS deps
COPY .packages/db/package.json ./packages/db/package.json
COPY .packages/api-zod/package.json ./packages/api-zod/package.json
COPY api-server/package.json ./api-server/package.json
COPY pnpm-workspace.yaml ./

# Copy source files
COPY .packages/db/src ./packages/db/src
COPY .packages/api-zod/src ./packages/api-zod/src
COPY api-server/src ./api-server/src

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# ---- Build the API server ----
FROM deps AS builder
RUN cd api-server && pnpm build

# ---- Production image ----
FROM base AS runner
ENV NODE_ENV=production

# Copy node_modules (pnpm store) from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/api-server ./api-server
COPY --from=deps /app/package.json ./package.json

# Copy built dist
COPY --from=builder /app/api-server/dist ./api-server/dist
COPY --from=builder /app/.packages/db/dist ./packages/db/dist

# Copy frontend static files
COPY index.html ./public/
COPY assets ./public/assets/
COPY favicon.svg ./public/
COPY .nojekyll ./public/

# Symlink workspace packages
RUN mkdir -p /app/node_modules/@workspace && \
    ln -s /app/packages/db /app/node_modules/@workspace/db && \
    ln -s /app/packages/api-zod /app/node_modules/@workspace/api-zod

EXPOSE 3000

CMD ["node", "--enable-source-maps", "api-server/dist/index.mjs"]
