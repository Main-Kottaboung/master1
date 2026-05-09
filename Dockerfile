## Multi-stage Dockerfile
# Two targets:
#   - dev (default): includes all deps for nodemon & hot reload
#   - prod: pruned for production

FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./

FROM base AS deps
RUN npm ci

FROM base AS deps-prod
RUN npm ci --omit=dev

FROM node:18-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . ./
# Generate Prisma client for development
RUN npx prisma generate || true
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:18-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps-prod /app/node_modules ./node_modules
COPY . ./
# Generate Prisma client for production
RUN npx prisma generate || true
EXPOSE 3000
CMD ["node", "src/index.js"]
