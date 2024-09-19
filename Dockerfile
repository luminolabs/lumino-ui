FROM node:22-bullseye

WORKDIR /app

# Copy code
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Build application
RUN yarn build