# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci

# Copy source and compile SPA
COPY . .
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Final runtime stage using lean Nginx image
FROM nginx:alpine

# Copy static build output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80