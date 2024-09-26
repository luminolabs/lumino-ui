FROM node:22-bullseye

WORKDIR /project

# Copy code
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile