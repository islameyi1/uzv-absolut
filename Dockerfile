FROM node:20-alpine AS builder
WORKDIR /app

# Update npm to latest (supports catalog: protocol)
RUN npm install -g npm@latest

# Copy api-server only
COPY artifacts/api-server ./api-server
RUN rm -rf api-server/node_modules 2>/dev/null; exit 0

# Install deps (fresh npm supports catalog:)
RUN cd api-server && npm install --legacy-peer-deps

# Copy lib source files for esbuild resolution
COPY lib ./lib

# Build
RUN cd api-server && node build.mjs

FROM node:20-alpine AS runner
WORKDIR /app

# Copy built files
COPY --from=builder /app/api-server/dist ./dist
COPY --from=builder /app/api-server/node_modules ./node_modules

# Copy frontend
COPY index.html ./public/
COPY assets ./public/assets/
COPY favicon.svg ./public/
COPY .nojekyll ./public/

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
