# Production Deployment Guide

This guide covers deploying the Tutoring System to a production server.

## Table of Contents

1. [Server Requirements](#server-requirements)
2. [Initial Server Setup](#initial-server-setup)
3. [Application Deployment](#application-deployment)
4. [SSL/HTTPS Setup](#sslhttps-setup)
5. [Queue Worker Setup](#queue-worker-setup)
6. [Laravel Scheduler](#laravel-scheduler)
7. [Frontend Process Manager](#frontend-process-manager)
8. [Backup Strategy](#backup-strategy)
9. [Monitoring Setup](#monitoring-setup)
10. [Security Checklist](#security-checklist)
11. [Scaling Considerations](#scaling-considerations)
12. [Troubleshooting Guide](#troubleshooting-guide)
13. [Rollback Procedure](#rollback-procedure)

---

## Server Requirements

### Minimum Hardware
- **CPU:** 2 vCPU
- **RAM:** 4 GB
- **Storage:** 40 GB SSD
- **OS:** Ubuntu 22.04 LTS (or newer)

### Recommended Hardware (Production)
- **CPU:** 4 vCPU
- **RAM:** 8 GB
- **Storage:** 80 GB SSD
- **OS:** Ubuntu 22.04 LTS

### Software Requirements
- PHP 8.2+ with extensions
- Node.js 20+
- MySQL 8.0+
- Redis 7+
- Nginx
- Supervisor
- Git
- Composer 2.x
- Let's Encrypt (Certbot)

### Required PHP Extensions
```
mbstring, pdo_mysql, redis, gd, zip, bcmath, intl, opcache, curl, xml, tokenizer
```

---

## Initial Server Setup

### 1. Create Non-Root User

```bash
# Create user
sudo adduser deployer

# Add to sudo group
sudo usermod -aG sudo deployer

# Switch to new user
su - deployer
```

### 2. SSH Key Setup

```bash
# On your local machine
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key to server
ssh-copy-id deployer@your-server-ip

# On server, disable password authentication
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
# Set: PermitRootLogin no

sudo systemctl restart sshd
```

### 3. Firewall Configuration (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

### 4. Install Required Packages

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common

# Add PHP repository
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP 8.2 and extensions
sudo apt install -y php8.2-fpm php8.2-cli php8.2-mysql php8.2-redis \
    php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd \
    php8.2-bcmath php8.2-intl php8.2-opcache

# Install MySQL
sudo apt install -y mysql-server

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install Supervisor
sudo apt install -y supervisor
```

### 5. Configure PHP-FPM

```bash
sudo nano /etc/php/8.2/fpm/pool.d/www.conf
```

Update these values:
```ini
user = deployer
group = deployer
listen = /run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data

pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

```bash
sudo systemctl restart php8.2-fpm
```

### 6. Configure MySQL

```bash
sudo mysql_secure_installation

# Login to MySQL
sudo mysql

# Create database and user
CREATE DATABASE tutoring_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tutoring'@'localhost' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON tutoring_system.* TO 'tutoring'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 7. Configure Redis

```bash
sudo nano /etc/redis/redis.conf

# Set:
# maxmemory 256mb
# maxmemory-policy allkeys-lru

sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

### 8. Install Node.js via NVM

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Install PM2 globally
npm install -g pm2
```

### 9. Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

---

## Application Deployment

### 1. Clone Repository

```bash
# Create web directory
sudo mkdir -p /var/www/tutoring-system
sudo chown deployer:deployer /var/www/tutoring-system

# Clone repository
cd /var/www/tutoring-system
git clone https://github.com/mahmoodhamdi/Tutoring-System.git .
```

### 2. Backend Setup

```bash
cd /var/www/tutoring-system/backend

# Install dependencies
composer install --no-dev --optimize-autoloader

# Copy and configure environment
cp .env.example .env
nano .env
```

Configure `.env`:
```env
APP_NAME="Tutoring System"
APP_ENV=production
APP_DEBUG=false
APP_KEY=
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tutoring_system
DB_USERNAME=tutoring
DB_PASSWORD=your-secure-password

REDIS_HOST=127.0.0.1
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

SENTRY_LARAVEL_DSN=your-sentry-dsn
```

```bash
# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed database (if needed)
php artisan db:seed --force

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Set permissions
sudo chown -R deployer:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 3. Frontend Setup

```bash
cd /var/www/tutoring-system/frontend

# Install dependencies
npm ci --production

# Create environment file
nano .env.local
```

Configure `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_SENTRY_DSN=your-frontend-sentry-dsn
```

```bash
# Build application
npm run build
```

### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/tutoring-system
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Laravel backend
    root /var/www/tutoring-system/backend/public;
    index index.php;

    client_max_body_size 50M;

    # API routes
    location /api {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location /docs {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
        fastcgi_read_timeout 300;
    }

    # Storage files
    location /storage {
        alias /var/www/tutoring-system/backend/storage/app/public;
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny hidden files
    location ~ /\. {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/tutoring-system /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## SSL/HTTPS Setup

### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Generate Certificates

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically adds a systemd timer
sudo systemctl status certbot.timer
```

---

## Queue Worker Setup

### Configure Supervisor

```bash
sudo nano /etc/supervisor/conf.d/tutoring-worker.conf
```

```ini
[program:tutoring-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/tutoring-system/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=deployer
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/tutoring-system/backend/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Reload supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start tutoring-worker:*

# Check status
sudo supervisorctl status
```

---

## Laravel Scheduler

```bash
# Add to crontab
crontab -e
```

Add this line:
```
* * * * * cd /var/www/tutoring-system/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## Frontend Process Manager

### Using PM2

```bash
cd /var/www/tutoring-system/frontend

# Create ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'tutoring-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/tutoring-system/frontend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Enable PM2 startup on boot
pm2 startup
# Run the command it outputs
```

---

## Backup Strategy

### Create Backup Script

```bash
nano /var/www/tutoring-system/scripts/backup.sh
```

```bash
#!/bin/bash
# Backup script for Tutoring System

set -e

# Configuration
BACKUP_DIR="/var/backups/tutoring-system"
DB_NAME="tutoring_system"
DB_USER="tutoring"
DB_PASS="your-db-password"
RETENTION_DAYS=7
RETENTION_WEEKS=4

# Create backup directory
mkdir -p $BACKUP_DIR/daily $BACKUP_DIR/weekly

# Date variables
DATE=$(date +%Y-%m-%d)
WEEKDAY=$(date +%u)

# Database backup
echo "Backing up database..."
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/daily/db-$DATE.sql.gz

# Files backup (uploads)
echo "Backing up uploaded files..."
tar -czf $BACKUP_DIR/daily/storage-$DATE.tar.gz -C /var/www/tutoring-system/backend storage/app/public

# Weekly backup (on Sundays)
if [ "$WEEKDAY" -eq 7 ]; then
    cp $BACKUP_DIR/daily/db-$DATE.sql.gz $BACKUP_DIR/weekly/
    cp $BACKUP_DIR/daily/storage-$DATE.tar.gz $BACKUP_DIR/weekly/
fi

# Cleanup old backups
find $BACKUP_DIR/daily -type f -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR/weekly -type f -mtime +$((RETENTION_WEEKS * 7)) -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x /var/www/tutoring-system/scripts/backup.sh
```

### Schedule Daily Backups

```bash
crontab -e
```

Add:
```
0 2 * * * /var/www/tutoring-system/scripts/backup.sh >> /var/log/tutoring-backup.log 2>&1
```

### Restore Procedure

```bash
# Restore database
gunzip < /var/backups/tutoring-system/daily/db-YYYY-MM-DD.sql.gz | mysql -u$DB_USER -p$DB_PASS $DB_NAME

# Restore files
tar -xzf /var/backups/tutoring-system/daily/storage-YYYY-MM-DD.tar.gz -C /var/www/tutoring-system/backend/
```

---

## Monitoring Setup

### 1. Configure Sentry DSN

Add your Sentry DSN to both backend and frontend `.env` files.

### 2. Health Check Endpoint

The API provides a health check at `/api/health`. Use monitoring services to check this endpoint.

### 3. Recommended Monitoring Services

- **Uptime:** UptimeRobot, Better Uptime, Pingdom
- **Error Tracking:** Sentry (already integrated)
- **Logs:** Papertrail, Logtail
- **Server:** Netdata, Prometheus + Grafana

### 4. Log Rotation

```bash
sudo nano /etc/logrotate.d/tutoring-system
```

```
/var/www/tutoring-system/backend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 deployer www-data
}
```

---

## Security Checklist

- [ ] `APP_DEBUG=false` in production
- [ ] `APP_ENV=production` is set
- [ ] Strong database passwords (16+ characters, mixed)
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Root SSH login disabled
- [ ] SSL/HTTPS enabled and forced
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] `.env` file protected (chmod 600)
- [ ] Storage directory permissions set correctly
- [ ] Regular security updates enabled
- [ ] Fail2ban installed (optional but recommended)
- [ ] Database accessible only from localhost

---

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer:** Use Nginx, HAProxy, or cloud LB
2. **Session Storage:** Already using Redis (scalable)
3. **Multiple Servers:** Deploy to multiple instances

### Database Scaling

1. **Read Replicas:** For read-heavy workloads
2. **Connection Pooling:** Use PgBouncer for PostgreSQL
3. **Query Optimization:** Monitor slow queries

### Redis Cluster

For high availability:
```bash
# Deploy Redis Sentinel or Redis Cluster
```

### CDN for Static Assets

1. Configure CloudFlare or AWS CloudFront
2. Update `ASSET_URL` in Laravel config

### Queue Workers Scaling

Increase `numprocs` in Supervisor config based on load.

---

## Troubleshooting Guide

### 502 Bad Gateway

```bash
# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# Check logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/www/tutoring-system/backend/storage/logs/laravel.log

# Restart services
sudo systemctl restart php8.2-fpm nginx
```

### 500 Internal Server Error

```bash
# Check Laravel logs
tail -f /var/www/tutoring-system/backend/storage/logs/laravel.log

# Check permissions
sudo chown -R deployer:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Clear caches
php artisan cache:clear
php artisan config:clear
```

### Database Connection Issues

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u tutoring -p tutoring_system

# Check credentials in .env
```

### Queue Not Processing

```bash
# Check Supervisor status
sudo supervisorctl status

# View worker logs
tail -f /var/www/tutoring-system/backend/storage/logs/worker.log

# Restart workers
sudo supervisorctl restart tutoring-worker:*
```

### Permission Denied Errors

```bash
# Fix ownership
sudo chown -R deployer:www-data /var/www/tutoring-system

# Fix permissions
sudo find /var/www/tutoring-system -type f -exec chmod 644 {} \;
sudo find /var/www/tutoring-system -type d -exec chmod 755 {} \;
sudo chmod -R 775 /var/www/tutoring-system/backend/storage
sudo chmod -R 775 /var/www/tutoring-system/backend/bootstrap/cache
```

### Log Locations

| Service | Log Location |
|---------|--------------|
| Laravel | `/var/www/tutoring-system/backend/storage/logs/laravel.log` |
| Nginx Access | `/var/log/nginx/access.log` |
| Nginx Error | `/var/log/nginx/error.log` |
| PHP-FPM | `/var/log/php8.2-fpm.log` |
| MySQL | `/var/log/mysql/error.log` |
| Supervisor | `/var/log/supervisor/supervisord.log` |
| Queue Worker | `/var/www/tutoring-system/backend/storage/logs/worker.log` |

---

## Rollback Procedure

### Code Rollback

```bash
cd /var/www/tutoring-system

# View recent commits
git log --oneline -10

# Rollback to specific commit
git checkout <commit-hash>

# Or rollback to previous commit
git reset --hard HEAD~1

# Reinstall dependencies and rebuild
cd backend && composer install --no-dev
cd ../frontend && npm ci && npm run build

# Clear caches
cd ../backend
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
sudo supervisorctl restart tutoring-worker:*
pm2 restart tutoring-frontend
```

### Database Rollback

```bash
# Rollback last migration
php artisan migrate:rollback

# Rollback specific number of migrations
php artisan migrate:rollback --step=2

# Restore from backup if needed
gunzip < /var/backups/tutoring-system/daily/db-YYYY-MM-DD.sql.gz | mysql -u tutoring -p tutoring_system
```

### Emergency Recovery

1. Put site in maintenance mode: `php artisan down`
2. Restore database from backup
3. Restore files from backup
4. Verify application works
5. Bring site back up: `php artisan up`

---

## GitHub Actions Secrets Required

For automated deployment, configure these secrets in your GitHub repository:

| Secret | Description |
|--------|-------------|
| `SSH_HOST` | Production server IP or hostname |
| `SSH_USER` | SSH user (e.g., `deployer`) |
| `SSH_KEY` | Private SSH key for authentication |
| `DEPLOY_PATH` | Path to application (e.g., `/var/www/tutoring-system`) |
| `PRODUCTION_DOMAIN` | Production domain name |

---

## Useful Commands Reference

```bash
# Backend
php artisan down                    # Maintenance mode on
php artisan up                      # Maintenance mode off
php artisan migrate --force         # Run migrations
php artisan config:cache            # Cache configuration
php artisan route:cache             # Cache routes
php artisan view:cache              # Cache views
php artisan queue:restart           # Restart queue workers
php artisan cache:clear             # Clear application cache

# Frontend
npm run build                       # Build for production
pm2 restart tutoring-frontend       # Restart frontend
pm2 logs tutoring-frontend          # View frontend logs

# Services
sudo systemctl restart nginx        # Restart Nginx
sudo systemctl restart php8.2-fpm   # Restart PHP-FPM
sudo supervisorctl restart all      # Restart all Supervisor processes
```
