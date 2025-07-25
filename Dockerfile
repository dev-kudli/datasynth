# Stage 1: Build the frontend using Node.js
FROM node:14.18.1 AS builder

WORKDIR /app
COPY . .

# Install and build inside /app/client
RUN cd client && yarn install && yarn build

# Stage 2: Serve with Nginx
FROM nginx:latest

# Copy build output from client
COPY --from=builder /app/client/build /usr/share/nginx/html

# Optional: custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9000
CMD ["nginx", "-g", "daemon off;"]
