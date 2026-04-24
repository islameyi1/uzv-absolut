FROM node:20-alpine AS builder
WORKDIR /app

# Copy everything (works if root dir is / or /api-server)
COPY package.json ./
COPY lib ./lib
COPY artifacts ./artifacts

# Remove node_modules
RUN rm -rf lib/*/node_modules artifacts/*/node_modules 2>/dev/null; exit 0

# Fix catalog: references
RUN find . -name 'package.json' -not -path '*/node_modules/*' -exec node -e "d=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));s=x=>{if(x)for(const[k,v]of Object.entries(x)){if(v==='catalog:'||v==='catalog:default')x[k]='*'}};s(d.dependencies);s(d.devDependencies);require('fs').writeFileSync(process.argv[1],JSON.stringify(d,null,2))" {} \;

# Install from root (npm workspaces)
RUN npm install --legacy-peer-deps

# Build api-server
RUN cd artifacts/api-server && node build.mjs

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/artifacts/api-server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY index.html ./public/
COPY assets ./public/assets/
COPY favicon.svg ./public/
COPY .nojekyll ./public/

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
