FROM node:20-alpine AS builder

WORKDIR /app/api-server
COPY api-server/ ./

# Fix package.json - remove workspace deps, fix catalog references
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));delete p.dependencies['@workspace/db'];delete p.dependencies['@workspace/api-zod'];delete p.dependencies['@types/bcryptjs'];delete p.dependencies['@types/jsonwebtoken'];const fix=(d)=>{if(!d)return;for(const[k,v]of Object.entries(d)){if(v==='catalog:'||v==='catalog:default')d[k]='*'}};fix(p.dependencies);fix(p.devDependencies);fs.writeFileSync('../package.json',JSON.stringify({name:'uzv-api',version:'1.0.0',private:true,type:'module',scripts:{build:'node build.mjs',start:'node --enable-source-maps dist/index.mjs'},dependencies:p.dependencies,devDependencies:p.devDependencies},null,2))"

# Install deps from root so node_modules is in /app/node_modules
WORKDIR /app
RUN npm install --legacy-peer-deps

# Build: node_modules is in /app/node_modules, build.mjs is in /app/api-server/
WORKDIR /app/api-server
RUN node build.mjs

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/api-server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY index.html ./public/
COPY assets ./public/assets/
COPY favicon.svg ./public/
COPY .nojekyll ./public/

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
