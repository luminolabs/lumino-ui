# Stage 1: Building the code
FROM node:18-alpine AS builder

WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn

# Copy package.json, yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Run the built code
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Install yarn
RUN apk add --no-cache yarn

# Copy necessary files from builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src

# Install production dependencies
RUN yarn install --production --frozen-lockfile

EXPOSE 3000

ENV PORT 3000

# Use Next.js start command instead of node server.js
CMD ["yarn", "start"]