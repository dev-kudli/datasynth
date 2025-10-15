# ------------------------
# Stage 1: Build dependencies
# ------------------------
FROM node:18-alpine AS builder

ENV HOME=/home/app/generatedata
WORKDIR $HOME

# Copy dependency manifests first for layer caching
COPY package.json yarn.lock ./
RUN yarn install --production=false --network-timeout 100000

# Copy full project
COPY . .

# ------------------------
# Stage 2: Runtime
# ------------------------
FROM node:18-alpine

ENV NODE_ENV=production
ENV HOME=/home/app/generatedata
WORKDIR $HOME

# Copy only built artifacts & dependencies from builder
COPY --from=builder $HOME $HOME
RUN yarn install --production --ignore-scripts && yarn cache clean

EXPOSE 3001
CMD ["yarn", "startNodeProdServer"]
