FROM node:20-alpine AS builder
WORKDIR /app

# Copy entire project structure
COPY package.json ./
COPY lib ./lib
COPY artifacts ./artifacts

# Remove any node_modules that came with
RUN rm -rf lib/*/node_modules artifacts/*/node_modules 2>/dev/null; exit 0

# Fix catalog: references in all package.json files
RUN find . -name 'package.json' -not -path '*/node_modules/*' -exec node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));const fix=d=>{if(!d)return;for(const[k,v]of Object.entries(d)){if(v==='catalog:'||v==='catalog:default')d[k]='*'}};fix(p.dependencies);fix(p.devDependencies);fs.writeFileSync(process.argv[1],JSON.stringify(p,null,2))" {} \;

# Install all workspaces from root
RUN npm install --legacy-peer-deps

# Build api-server
RUN npm run build:api

FROM node:20-alpine AS runner
WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/artifacts/api-server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy frontend
COPY index.html ./public/
COPY assets ./public/assets/
COPY favicon.svg ./public/
COPY .nojekyll ./public/

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
