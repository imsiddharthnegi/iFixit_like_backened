# Deployment Guide

This guide provides step-by-step instructions for deploying the iFixit-like Backend API to various platforms.

## Table of Contents

1. [Render Deployment (Recommended)](#render-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Manual Server Deployment](#manual-server-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Post-Deployment Testing](#post-deployment-testing)
6. [Troubleshooting](#troubleshooting)

## Render Deployment (Recommended)

Render is a cloud platform that makes it easy to deploy Node.js applications with automatic builds and deployments.

### Prerequisites

- GitHub account
- Render account (free tier available)
- Forked repository of this project

### Step 1: Prepare Your Repository

1. **Fork this repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ifixit-backend.git
   cd ifixit-backend
   ```

3. **Update package.json** with your repository URL:
   ```json
   {
     "repository": {
       "type": "git",
       "url": "https://github.com/YOUR_USERNAME/ifixit-backend.git"
     }
   }
   ```

4. **Commit and push** your changes:
   ```bash
   git add .
   git commit -m "Update repository URL"
   git push origin main
   ```

### Step 2: Create Render Service

1. **Go to Render Dashboard**
   - Visit [https://dashboard.render.com](https://dashboard.render.com)
   - Sign in or create an account

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your forked repository

3. **Configure Service Settings**
   - **Name**: `ifixit-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   - Click "Advanced" to expand options
   - Add environment variables:
     ```
     NODE_ENV=production
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete (5-10 minutes)

### Step 3: Verify Deployment

Once deployed, your API will be available at:
```
https://YOUR_SERVICE_NAME.onrender.com
```

Test the deployment:
```bash
curl https://YOUR_SERVICE_NAME.onrender.com
curl https://YOUR_SERVICE_NAME.onrender.com/api/categories
```

### Step 4: Set Up Database

The SQLite database needs to be initialized on first deployment:

1. **Access Render Shell** (if needed):
   - Go to your service dashboard
   - Click "Shell" tab
   - Run: `npm run seed`

Note: The database will be automatically created and seeded on the first startup.

## Docker Deployment

Deploy using Docker for containerized environments.

### Prerequisites

- Docker installed
- Docker Hub account (optional, for registry)

### Step 1: Build Docker Image

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ifixit-backend.git
   cd ifixit-backend
   ```

2. **Build the image**:
   ```bash
   docker build -t ifixit-backend .
   ```

3. **Test locally**:
   ```bash
   docker run -p 3000:3000 ifixit-backend
   ```

### Step 2: Deploy to Production

#### Option A: Docker Hub

1. **Tag and push to Docker Hub**:
   ```bash
   docker tag ifixit-backend YOUR_USERNAME/ifixit-backend
   docker push YOUR_USERNAME/ifixit-backend
   ```

2. **Deploy on your server**:
   ```bash
   docker pull YOUR_USERNAME/ifixit-backend
   docker run -d -p 3000:3000 --name ifixit-api YOUR_USERNAME/ifixit-backend
   ```

#### Option B: Direct Deployment

1. **Copy files to server**:
   ```bash
   scp -r . user@your-server:/path/to/app
   ```

2. **Build and run on server**:
   ```bash
   ssh user@your-server
   cd /path/to/app
   docker build -t ifixit-backend .
   docker run -d -p 3000:3000 --name ifixit-api ifixit-backend
   ```

### Step 3: Set Up Reverse Proxy (Optional)

For production, set up Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Manual Server Deployment

Deploy directly on a VPS or dedicated server.

### Prerequisites

- Ubuntu/Debian server with sudo access
- Domain name (optional)

### Step 1: Prepare Server

1. **Update system**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2** (process manager):
   ```bash
   sudo npm install -g pm2
   ```

4. **Create application user**:
   ```bash
   sudo adduser --system --group ifixit
   sudo mkdir -p /var/www/ifixit-backend
   sudo chown ifixit:ifixit /var/www/ifixit-backend
   ```

### Step 2: Deploy Application

1. **Clone repository**:
   ```bash
   sudo -u ifixit git clone https://github.com/YOUR_USERNAME/ifixit-backend.git /var/www/ifixit-backend
   cd /var/www/ifixit-backend
   ```

2. **Install dependencies**:
   ```bash
   sudo -u ifixit npm ci --only=production
   ```

3. **Set up environment**:
   ```bash
   sudo -u ifixit cp .env.example .env
   sudo -u ifixit nano .env
   ```

   Configure:
   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **Initialize database**:
   ```bash
   sudo -u ifixit npm run seed
   ```

### Step 3: Configure PM2

1. **Create PM2 ecosystem file**:
   ```bash
   sudo -u ifixit nano ecosystem.config.js
   ```

   Content:
   ```javascript
   module.exports = {
     apps: [{
       name: 'ifixit-backend',
       script: 'server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

2. **Start application**:
   ```bash
   sudo -u ifixit pm2 start ecosystem.config.js
   sudo -u ifixit pm2 save
   sudo pm2 startup
   ```

### Step 4: Set Up Nginx (Optional)

1. **Install Nginx**:
   ```bash
   sudo apt install nginx -y
   ```

2. **Configure site**:
   ```bash
   sudo nano /etc/nginx/sites-available/ifixit-backend
   ```

   Content:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ifixit-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Environment Configuration

### Required Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | Yes |
| `PORT` | Server port | `3000` | No |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database file path | `./database/ifixit.db` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |
| `LOG_LEVEL` | Logging level | `info` |

### Example .env File

```bash
# Production environment
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=./database/ifixit.db

# Security
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
```

## Post-Deployment Testing

### Health Check

Test that your API is running:

```bash
# Replace with your actual URL
curl https://your-app.onrender.com
```

Expected response:
```json
{
  "message": "iFixit-like Backend API",
  "version": "1.0.0",
  "endpoints": {
    "categories": "/api/categories",
    "devices": "/api/devices",
    "guides": "/api/guides"
  }
}
```

### API Endpoints Test

```bash
# Test categories
curl https://your-app.onrender.com/api/categories

# Test specific category
curl https://your-app.onrender.com/api/categories/apple

# Test devices in category
curl https://your-app.onrender.com/api/categories/apple/devices

# Test specific device
curl https://your-app.onrender.com/api/devices/iphone-11

# Test device guides
curl https://your-app.onrender.com/api/devices/iphone-11/guides

# Test specific guide
curl https://your-app.onrender.com/api/guides/iphone-11-battery-replacement
```

### Load Testing (Optional)

For production deployments, consider load testing:

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 https://your-app.onrender.com/api/categories
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Problem**: npm install fails during build

**Solution**:
- Check Node.js version compatibility
- Verify package.json syntax
- Check for missing dependencies

#### 2. Database Issues

**Problem**: Database not found or empty

**Solution**:
```bash
# Re-run seed script
npm run seed

# Check database file exists
ls -la database/
```

#### 3. Port Issues

**Problem**: Port already in use

**Solution**:
```bash
# Find process using port
sudo lsof -i :3000

# Kill process
sudo kill -9 PID

# Or use different port
export PORT=3001
```

#### 4. Permission Issues

**Problem**: File permission errors

**Solution**:
```bash
# Fix ownership
sudo chown -R ifixit:ifixit /var/www/ifixit-backend

# Fix permissions
sudo chmod -R 755 /var/www/ifixit-backend
```

### Logs and Monitoring

#### Render Logs
- Access logs through Render dashboard
- Click on your service → "Logs" tab

#### PM2 Logs
```bash
# View logs
pm2 logs ifixit-backend

# Monitor in real-time
pm2 monit
```

#### Docker Logs
```bash
# View container logs
docker logs ifixit-api

# Follow logs in real-time
docker logs -f ifixit-api
```

### Performance Optimization

#### 1. Enable Gzip Compression

Add to your Nginx configuration:
```nginx
gzip on;
gzip_types text/plain application/json application/javascript text/css;
```

#### 2. Set Up Caching

Add caching headers:
```nginx
location /api/ {
    proxy_pass http://localhost:3000;
    proxy_cache_valid 200 5m;
    add_header Cache-Control "public, max-age=300";
}
```

#### 3. Database Optimization

For production with high traffic, consider:
- Moving to PostgreSQL or MySQL
- Adding database indexes
- Implementing connection pooling

### Security Considerations

1. **Use HTTPS** in production
2. **Set up firewall** rules
3. **Regular security updates**
4. **Monitor access logs**
5. **Implement rate limiting** if needed

### Backup Strategy

1. **Database backups**:
   ```bash
   # Backup SQLite database
   cp database/ifixit.db backups/ifixit-$(date +%Y%m%d).db
   ```

2. **Automated backups**:
   ```bash
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

## Support

If you encounter issues during deployment:

1. Check the [troubleshooting section](#troubleshooting)
2. Review application logs
3. Verify environment configuration
4. Test locally first
5. Create an issue on GitHub with detailed error information

For additional help, include:
- Platform (Render, Docker, manual)
- Error messages
- Environment details
- Steps to reproduce

