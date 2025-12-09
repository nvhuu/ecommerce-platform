FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npx turbo run build --filter=cms

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/cms/.next ./.next
COPY --from=builder /app/apps/cms/public ./public
COPY --from=builder /app/apps/cms/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port (CMS 3001)
EXPOSE 3001

CMD ["npx", "next", "start", "--port", "3001"]
