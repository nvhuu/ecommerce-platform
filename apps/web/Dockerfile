FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npx turbo run build --filter=web

FROM node:20-alpine AS runner
WORKDIR /app

# We assume standard Next.js build (not standalone) for simplicity
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port (Next.js default 3000)
EXPOSE 3000

CMD ["npx", "next", "start"]
