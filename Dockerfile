# Multi-stage Dockerfile for AIandML Platform
# This containerizes the entire learning platform for easy deployment

# ========== BUILD STAGE ==========
# Prepares all static assets and content
FROM node:18-alpine as builder

WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies if needed (e.g., for any asset processing)
# RUN npm install  # Uncomment if using npm

# ========== RUNTIME STAGE ==========
# Light-weight nginx server to serve static content
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy static files from builder
COPY --from=builder /app .

# ========== NGINX CONFIGURATION ==========
# Use a separate config file (nginx/default.conf) and copy it into the image
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
