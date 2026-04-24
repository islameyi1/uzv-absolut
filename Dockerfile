FROM node:20-alpine AS builder
WORKDIR /app

# Copy api-server only
COPY artifacts/api-server ./api-server

# Remove existing node_modules
RUN rm -rf api-server/node_modules 2>/dev/null; exit 0

# Fix catalog: references
RUN find . -name 'package.json' -not -path '*/node_modules/*' -exec node -e "d=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));s=x=>{if(x)for(const[k,v]of Object.entries(x)){if(v==='catalog:'||v==='catalog:default')x[k]='*'}};s(d.dependencies);s(d.devDependencies);require('fs').writeFileSync(process.argv[1],JSON.stringify(d,null,2))" {} \;

# Install deps
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
