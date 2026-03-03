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
# Configure nginx to serve the SPA with proper routing
COPY << 'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    
    # Enable gzip compression for faster loading
    gzip on;
    gzip_types text/html text/css application/javascript application/json text/xml;
    gzip_min_length 1024;
    
    # Cache configuration
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
    
    # Serve HTML files without caching (for instant updates)
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "must-revalidate";
    }
    
    # Main location block
    location / {
        # Try file, then directory, then index.html (SPA routing)
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
EOF

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
