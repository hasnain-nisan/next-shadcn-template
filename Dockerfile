# 1. Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (better caching)
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install --frozen-lockfile

# Copy source code
COPY . .

# Load production env variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js
RUN npm run build

# 2. Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only necessary output files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.production ./.env.production

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
