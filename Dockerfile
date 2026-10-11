# Build stage for Vite static bundle
FROM node:20-alpine AS build-stage

WORKDIR /app

# Prevent Puppeteer from downloading huge 350MB Chromium binary during frontend build
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy dependency manifests
COPY package*.json ./

# Install dependencies fast
RUN npm ci --prefer-offline --no-audit

# Copy project files
COPY . .

# Build the production bundle
RUN npm run build

# Production stage (Lightweight Nginx)
FROM nginx:alpine AS production-stage

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
