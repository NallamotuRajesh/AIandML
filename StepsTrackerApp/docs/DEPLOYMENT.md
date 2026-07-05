# Deployment Guide

This guide covers deployment options for the Steps Tracker application.

## Table of Contents
- [Backend Deployment](#backend-deployment)
- [Mobile App Deployment](#mobile-app-deployment)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Security Considerations](#security-considerations)

## Backend Deployment

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

#### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd StepsTrackerApp
```

2. **Set up environment variables**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

3. **Build and start services**
```bash
docker-compose up -d
```

4. **Initialize database**
```bash
docker-compose exec backend python init_db.py
```

5. **Verify deployment**
```bash
curl http://localhost:8000/health
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

#### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Restart services
docker-compose restart

# Rebuild after code changes
docker-compose up -d --build
```

### Option 2: Manual Deployment

#### Prerequisites
- Python 3.12+
- PostgreSQL 15+ (or SQLite for development)

#### Steps

1. **Set up Python environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env file with your settings
```

3. **Initialize database**
```bash
python init_db.py
```

4. **Run the application**
```bash
# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production (with gunicorn)
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Option 3: Cloud Deployment

#### AWS EC2

1. Launch an EC2 instance (Ubuntu 22.04 LTS recommended)
2. Install Docker and Docker Compose
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER
```
3. Clone repository and follow Docker deployment steps
4. Configure security group to allow port 8000
5. (Optional) Set up Nginx as reverse proxy and SSL

#### Heroku

1. Create Heroku app
```bash
heroku create steps-tracker-api
```

2. Add PostgreSQL addon
```bash
heroku addons:create heroku-postgresql:mini
```

3. Set environment variables
```bash
heroku config:set SECRET_KEY=your-secret-key
```

4. Create `Procfile`
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

5. Deploy
```bash
git push heroku main
```

#### Google Cloud Run

1. Build container image
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/steps-tracker-api
```

2. Deploy to Cloud Run
```bash
gcloud run deploy steps-tracker-api \
  --image gcr.io/PROJECT_ID/steps-tracker-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Mobile App Deployment

### Development Build

1. **Install Expo CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure project**
```bash
cd mobile
eas build:configure
```

4. **Build for Android**
```bash
# Development build
eas build --platform android --profile development

# Preview build (APK)
eas build --platform android --profile preview

# Production build (AAB for Play Store)
eas build --platform android --profile production
```

### Google Play Store Deployment

1. **Prepare production build**
```bash
eas build --platform android --profile production
```

2. **Download AAB file from Expo**

3. **Create Play Console account**
- Go to https://play.google.com/console
- Pay one-time $25 registration fee

4. **Create app listing**
- Fill in app details
- Upload screenshots and graphics
- Set content rating
- Set pricing (Free/Paid)

5. **Upload AAB**
- Go to Release > Production
- Create new release
- Upload AAB file
- Fill release notes
- Submit for review

### Over-the-Air (OTA) Updates

Expo EAS Update allows pushing updates without app store review:

```bash
# Configure EAS Update
eas update:configure

# Publish update
eas update --branch production --message "Bug fixes"
```

## Database Setup

### PostgreSQL (Production)

1. **Create database**
```sql
CREATE DATABASE stepsdb;
CREATE USER stepsuser WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE stepsdb TO stepsuser;
```

2. **Update connection string**
```
DATABASE_URL=postgresql://stepsuser:your-secure-password@localhost:5432/stepsdb
```

3. **Run migrations**
```bash
python init_db.py
```

### SQLite (Development)

SQLite is used by default for development. No additional setup required.

## Environment Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Security
SECRET_KEY=your-secret-key-min-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Steps Tracker API

# CORS (if needed)
BACKEND_CORS_ORIGINS=["http://localhost:3000","https://yourdomain.com"]
```

### Mobile App Configuration

Update API URL in `mobile/src/services/api.js`:

```javascript
const API_URL = 'https://your-api-domain.com';  // Change from localhost
```

## Security Considerations

### Backend Security

1. **Generate secure SECRET_KEY**
```bash
openssl rand -hex 32
```

2. **Use HTTPS in production**
- Set up SSL certificate (Let's Encrypt)
- Configure Nginx/Apache as reverse proxy

3. **Enable rate limiting**
```python
# Add to main.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

4. **Use environment variables**
- Never commit `.env` files
- Use secrets management (AWS Secrets Manager, Google Secret Manager)

5. **Database security**
- Use strong passwords
- Enable SSL for database connections
- Regular backups

### Mobile App Security

1. **API key management**
- Don't hardcode API keys
- Use environment variables or secure storage

2. **Data encryption**
- Encrypt sensitive data in AsyncStorage
- Use HTTPS for all API calls

3. **Authentication**
- Implement token refresh
- Secure token storage
- Logout on suspicious activity

## Monitoring & Logging

### Backend Monitoring

1. **Add logging**
```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

2. **Health checks**
```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
```

3. **Error tracking**
- Sentry integration
- CloudWatch (AWS)
- Stackdriver (GCP)

### Performance Optimization

1. **Database indexing**
```sql
CREATE INDEX idx_user_steps_date ON steps(user_id, date);
CREATE INDEX idx_user_exercises ON exercises(user_id, started_at);
```

2. **Caching**
- Redis for session storage
- Cache frequently accessed data

3. **Connection pooling**
```python
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20
)
```

## Backup & Recovery

### Database Backups

1. **Automated backups**
```bash
# PostgreSQL backup
pg_dump -U stepsuser stepsdb > backup_$(date +%Y%m%d).sql

# Restore
psql -U stepsuser stepsdb < backup_20240101.sql
```

2. **Schedule with cron**
```bash
0 2 * * * /usr/local/bin/backup_db.sh
```

## Troubleshooting

### Common Issues

1. **Database connection failed**
- Check DATABASE_URL
- Verify database is running
- Check firewall rules

2. **CORS errors**
- Update CORS_ORIGINS in config
- Verify API URL in mobile app

3. **Build failures**
- Clear Docker cache: `docker-compose build --no-cache`
- Check logs: `docker-compose logs -f`

## Support

For issues and questions:
- GitHub Issues: <your-repo-url>/issues
- Email: support@yourapp.com
