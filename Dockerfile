FROM node:20-alpine AS builder

WORKDIR /app

# Copy source code
COPY api-server/ ./api-server/

# Create root package.json - replace all catalog: references with valid semver ranges
# and remove workspace-specific deps
RUN node -e "
const fs=require('fs');
const p=JSON.parse(fs.readFileSync('api-server/package.json','utf8'));
delete p.dependencies['@workspace/db'];
delete p.dependencies['@workspace/api-zod'];
delete p.dependencies['@types/bcryptjs'];
delete p.dependencies['@types/jsonwebtoken'];
// Replace catalog: references with wildcard
const fix = (deps) => {
  if (!deps) return;
  for (const [k,v] of Object.entries(deps)) {
    if (v === 'catalog:') deps[k] = '*';
    if (v === 'catalog:default') deps[k] = '*';
  }
};
fix(p.dependencies);
fix(p.devDependencies);
fs.writeFileSync('package.json',JSON.stringify({
  name:'uzv-api',
  version:'1.0.0',
  private:true,
  type:'module',
  scripts:{build:'node build.mjs',start:'node --enable-source-maps dist/index.mjs'},
  dependencies:p.dependencies,
  devDependencies:p.devDependencies
},null,2));
"

RUN npm install

RUN node build.mjs

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY index.html ./public/
COPY assets ./public/assets/
COPY favicon.svg ./public/
COPY .nojekyll ./public/

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
