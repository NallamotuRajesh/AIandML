# 🚀 Deployment Guide - AIandML Platform

Complete guide to build, run, and deploy the AIandML learning platform to various hosting services.

---

## 📋 Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [GitHub Pages Deployment](#github-pages-deployment)
4. [Cloud Platform Deployment](#cloud-platform-deployment)
5. [Troubleshooting](#troubleshooting)

---

## 🏠 Local Development

### Prerequisites
- Python 3.7+
- Node.js 14+ (optional, for build tools)
- Git

### Quick Start

**1. Clone the repository**
```bash
git clone https://github.com/NallamotuRajesh/AIandML.git
cd AIandML
```

**2. Start local development server**
```bash
# Using Python (simplest)
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000
```

**3. Open in browser**
```
http://localhost:8000
```

### Development Features
- Hot reload: Refresh browser to see changes
- No build step required (static HTML/CSS/JS)
- Direct file editing in VS Code

---

## 🐳 Docker Deployment

Docker containerizes the entire platform for consistent deployment across environments.

### Prerequisites
- Docker 20.0+
- Docker Compose 2.0+ (optional but recommended)

### Build & Run with Docker

**1. Build the Docker image**
```bash
cd /workspaces/AIandML
docker build -t aiandml-platform:latest .
```

**2. Run the container**
```bash
# Interactive (see logs)
docker run -p 8080:80 aiandml-platform:latest

# Background (daemon mode)
docker run -d -p 8080:80 --name aiandml aiandml-platform:latest
```

**3. Access the application**
```
http://localhost:8080
```

**4. Stop the container**
```bash
docker stop aiandml
docker rm aiandml
```

### Using Docker Compose (Recommended)

**1. Deploy with docker-compose**
```bash
cd /workspaces/AIandML
docker-compose up -d  # Run in background
```

**2. View logs**
```bash
docker-compose logs -f web  # Follow logs
```

**3. Stop all services**
```bash
docker-compose down
```

### Docker Image Features
- ✅ Nginx web server (production-ready)
- ✅ Gzip compression for fast loading
- ✅ Proper cache headers for assets
- ✅ Health checks enabled
- ✅ Alpine Linux base (lightweight ~50MB)

---

## 📄 GitHub Pages Deployment

Deploy directly from GitHub repository for free hosting with `username.github.io` subdomain.

### Option 1: Automatic Deployment via GitHub Actions (Recommended)

**1. Push to main branch** (already configured)
```bash
git add -A
git commit -m "Update content"
git push origin main
```

**2. GitHub Actions automatically:**
- Builds Docker image
- Validates HTML
- Deploys to GitHub Pages
- Checks performance

**3. Access your site:**
```
https://NallamotuRajesh.github.io/AIandML
```

### Option 2: Manual GitHub Pages Deployment

**1. Update GitHub Pages settings**
- Go to repo → Settings → Pages
- Source: Select `main` branch
- Save

**2. Deploy**
```bash
git push origin main
```

**3. Access at:**
```
https://NallamotuRajesh.github.io/AIandML
```

### Domain Configuration (Optional)

To use a custom domain:

**1. Update CNAME in workflow**
Edit `.github/workflows/deploy.yml`:
```yaml
cname: aiandml.yourdomain.com
```

**2. Point domain DNS to GitHub Pages**
```
yourdomain.com → NallamotuRajesh.github.io
```

---

## ☁️ Cloud Platform Deployment

### AWS S3 + CloudFront

**1. Create S3 bucket**
```bash
aws s3 mb s3://aiandml-platform
```

**2. Upload files**
```bash
aws s3 sync . s3://aiandml-platform --exclude ".git*" --exclude "Dockerfile"
```

**3. Create CloudFront distribution**
- Origin: S3 bucket URL
- Default root object: `index.html`
- Compress objects automatically: ✅

**4. Access via CloudFront URL**
```
https://d1234567890.cloudfront.net
```

### Netlify

**1. Connect GitHub repository**
- Go to netlify.com
- Click "New site from Git"
- Select AIandML repository

**2. Configure build settings**
- Build command: (leave empty - static site)
- Publish directory: `.`

**3. Deploy**
- Netlify automatically deploys on push to main

**4. Access at**
```
https://aiandml.netlify.app
```

### Vercel

**1. Import project**
```bash
npm i -g vercel
vercel
```

**2. Follow prompts**
- Select framework: Other (Static)
- Build command: (skip)
- Output directory: `.`

**3. Deploy**
```bash
vercel --prod
```

**4. Access at**
```
https://aiandml.vercel.app
```

### Heroku (with Node server)

**1. Create Procfile**
```
web: node server.js
```

**2. Create server.js**
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            filePath = path.join(__dirname, 'index.html');
            fs.readFile(filePath, 'utf8', (err, content) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            });
        } else {
            res.writeHead(200);
            res.end(content);
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**3. Deploy**
```bash
heroku login
heroku create aiandml
git push heroku main
```

---

## 🔍 Troubleshooting

### Issue: 404 error when accessing
**Solution:** Ensure index.html exists in root directory
```bash
ls -la index.html
```

### Issue: CSS/JS files not loading (404)
**Solution:** Check file paths in index.html are correct
```bash
# Verify all referenced files exist
grep -o 'src="[^"]*\|href="[^"]*' index.html | cut -d'"' -f2 | while read f; do
  [ ! -e "$f" ] && echo "MISSING: $f"
done
```

### Issue: Performance is slow
**Solution:** Enable compression in server
```bash
# Docker already has gzip enabled
# For local development, use:
npm install -g http-server-gzip
http-server-gzip -p 8000 -g
```

### Issue: Docker container won't start
**Solution:** Check logs
```bash
docker logs aiandml  # Replace with container ID/name
```

### Issue: Domain not working with GitHub Pages
**Solution:** Verify CNAME record
```bash
dig aiandml.yourdomain.com
# Should resolve to: NallamotuRajesh.github.io
```

---

## 📊 Deployment Comparison

| Method | Cost | Setup Time | Performance | Auto-deploy |
|--------|------|------------|-------------|------------|
| Local Dev | Free | 2 min | Good (local) | N/A |
| Docker | Free (self-hosted) | 10 min | Excellent | Manual |
| GitHub Pages | Free | 5 min | Good | ✅ (Actions) |
| Netlify | Free/Paid | 3 min | Excellent | ✅ |
| Vercel | Free/Paid | 3 min | Excellent | ✅ |
| AWS S3+CF | $0.50-5/mo | 20 min | Excellent | Manual |
| Heroku | $7+/mo | 10 min | Good | ✅ |

---

## 🎯 Recommended Deployment Path

**For Development:**
```bash
python3 -m http.server 8000
```

**For Testing/Sharing:**
```bash
docker-compose up -d
# Share: http://your-ip:8080
```

**For Production:**
1. **Free tier:** GitHub Pages (automatic via GitHub Actions)
2. **Advanced:** Netlify or Vercel (free tier with auto-deploy)
3. **Enterprise:** AWS S3 + CloudFront or Kubernetes

---

## 📱 Verify Deployment

After deploying, verify everything works:

```bash
# Check status
curl -I https://your-domain.com

# Check HTML is valid
curl https://your-domain.com | head -20

# Performance test
curl -w "Time: %{time_total}s\n" https://your-domain.com > /dev/null
```

---

**Need help?** Check the main [README.md](README.md) or open an issue on GitHub.
