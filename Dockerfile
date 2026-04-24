FROM node:20-alpine AS builder
WORKDIR /app

# Copy all source files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.base.json tsconfig.json ./
COPY lib ./lib
COPY artifacts/api-server ./artifacts/api-server
COPY api-server ./api-server 2>/dev/null || true

# Remove node_modules if any (shouldn't exist, but just in case)
RUN rm -rf artifacts/api-server/node_modules lib/*/node_modules 2>/dev/null; exit 0

# Convert pnpm workspace to flat npm project
# Replace catalog: references and workspace:* deps
RUN node -e "
const fs=require('fs');
const p=JSON.parse(fs.readFileSync('artifacts/api-server/package.json','utf8'));
delete p.dependencies['@types/bcryptjs'];
delete p.dependencies['@types/jsonwebtoken'];
const fix=(d)=>{if(!d)return;for(const[k,v]of Object.entries(d)){if(v==='catalog:'||v==='catalog:default')d[k]='*';if(v==='workspace:*')d[k]='*'}};
fix(p.dependencies);
fix(p.devDependencies);
fs.writeFileSync('artifacts/api-server/package.json',JSON.stringify(p,null,2));
"

# Install dependencies
RUN cd artifacts/api-server && npm install --legacy-peer-deps

# Build
RUN cd artifacts/api-server && node build.mjs

FROM node:20-alpine AS runner
WORKDIR /app

# Copy built files
COPY --from=builder /app/artifacts/api-server/dist ./dist
COPY --from=builder /app/artifacts/api-server/node_modules ./node_modules

# Copy frontend
COPY index.html ./public/
COPY assets ./public/assets/
COPY favicon.svg ./public/
COPY .nojekyll ./public/

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
