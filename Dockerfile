FROM node:20-alpine AS builder

WORKDIR /app
COPY api-server/ ./api-server/

# Fix package.json - remove workspace deps, fix catalog references
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('api-server/package.json','utf8'));delete p.dependencies['@workspace/db'];delete p.dependencies['@workspace/api-zod'];delete p.dependencies['@types/bcryptjs'];delete p.dependencies['@types/jsonwebtoken'];const fix=(d)=>{if(!d)return;for(const[k,v]of Object.entries(d)){if(v==='catalog:'||v==='catalog:default')d[k]='*'}};fix(p.dependencies);fix(p.devDependencies);fs.writeFileSync('api-server/package.json',JSON.stringify(p,null,2))"

# Install dependencies directly in api-server folder
WORKDIR /app/api-server
RUN npm install --legacy-peer-deps

# Build - node_modules is right here
RUN node build.mjs

# Move dist back to /app for runner
RUN cp -r dist /app/dist

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/api-server/node_modules ./node_modules

COPY index.html ./public/
COPY assets ./public/assets/
COPY favicon.svg ./public/
COPY .nojekyll ./public/

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
