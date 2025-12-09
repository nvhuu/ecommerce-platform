FROM node:20-alpine AS builder

WORKDIR /app

# Copy root files for workspace management
COPY package*.json turbo.json ./
# Copy workspace definitions
COPY apps/api/package.json ./apps/api/package.json
# Copy shared packages if any (assuming none for now or standard structure)
# If explicit shared packages exist, they must be copied.

# Install dependencies (from root to handle workspaces)
# Note: In a real monorepo with shared libs, we need `turbo prune`. 
# For simplicity in this shell script generation, we copy the whole repo context
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build API
WORKDIR /app
RUN npx turbo run build --filter=api

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Prisma Client if needed (it's usually in node_modules, so copied above)

CMD ["node", "dist/main"]
