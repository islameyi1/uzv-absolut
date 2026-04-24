FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Remove git history and unnecessary files
RUN rm -rf .git api-server/lib api-server/node_modules pnpm-lock.yaml pnpm-workspace.yaml 2>/dev/null; exit 0

# Create package.json for the root
RUN node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('api-server/package.json', 'utf8'));
// Remove workspace dependencies
delete pkg.dependencies['@workspace/db'];
delete pkg.dependencies['@workspace/api-zod'];
delete pkg.dependencies['@types/bcryptjs'];
delete pkg.dependencies['@types/jsonwebtoken'];
fs.writeFileSync('package.json', JSON.stringify({
  name: 'uzv-api',
  version: '1.0.0',
  private: true,
  type: 'module',
  scripts: {
    build: 'node build.mjs',
    start: 'node --enable-source-maps dist/index.mjs'
  },
  dependencies: pkg.dependencies,
  devDependencies: pkg.devDependencies
}, null, 2));
"

# Install dependencies
RUN npm install

# Build the bundled API server
RUN node build.mjs

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
