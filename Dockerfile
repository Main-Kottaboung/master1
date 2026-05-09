## Multi-stage Dockerfile
# - builds Prisma client during image build
# - supports mounting source for local dev (via docker-compose) and running `npm run dev`

FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . ./
# Generate Prisma client at build time (safe when DATABASE_URL is available at build or ignored)
RUN npx prisma generate || true

FROM node:18-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
# remove dev deps to keep image small
RUN npm prune --production || true
EXPOSE 3000
CMD ["node", "src/index.js"]

# Notes:
# - For local dev with hot reload, use docker-compose with a bind mount and override command to `npm run dev`.FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
