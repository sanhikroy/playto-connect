# Deployment Guide

This document provides instructions for deploying the Connect application to a production environment.

## Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- AWS account (for S3 storage and optional hosting)
- Vercel account (recommended deployment platform)
- Access to domain registrar for DNS configuration

## Environment Setup

### 1. Configure Environment Variables

Copy the `.env.production` file and update values:

```
# Database configuration
DATABASE_PROVIDER="postgresql"
DATABASE_URL="postgresql://username:password@hostname:port/database?schema=public"

# Authentication
NEXTAUTH_URL="https://your-production-domain.com"
NEXTAUTH_SECRET="your-secure-random-string"

# Storage (S3)
S3_BUCKET="your-media-bucket"
S3_REGION="us-east-1"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn" 
```

Generate a secure random string for NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 2. Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE connect;
CREATE USER connect_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE connect TO connect_user;
```

2. Run database migrations:

```bash
npm run prisma:deploy
```

### 3. Build the Application

```bash
npm run build
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy the application:

```bash
vercel --prod
```

4. Configure environment variables in the Vercel dashboard.

### Option 2: AWS Elastic Beanstalk

1. Install the EB CLI:

```bash
pip install awsebcli
```

2. Initialize EB:

```bash
eb init
```

3. Create environment:

```bash
eb create production
```

4. Deploy:

```bash
eb deploy
```

### Option 3: Self-hosted Server

1. Install PM2:

```bash
npm install -g pm2
```

2. Start the application:

```bash
pm2 start npm --name "connect" -- start
```

3. Set up Nginx as a reverse proxy:

```
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

4. Set up SSL with Certbot:

```bash
certbot --nginx -d your-domain.com
```

## Database Backup

Set up automatic backups using the provided script:

```bash
# Set up environment variables
export DB_USER=connect_user
export DB_PASSWORD=your-password
export DB_NAME=connect
export USE_S3_BACKUP=true
export S3_BACKUP_BUCKET=your-backup-bucket

# Run backup script
node scripts/backup-database.js
```

Add to crontab to run daily:

```
0 2 * * * cd /path/to/app && node scripts/backup-database.js >> /var/log/db-backups.log 2>&1
```

## Domain and DNS Setup

1. Purchase a domain name from a registrar (e.g., Namecheap, GoDaddy).

2. Configure DNS settings:

```
A     @        [IP address or Vercel/AWS endpoint]
CNAME www      your-domain.com
```

3. Set up SSL certificate.

## Monitoring and Maintenance

### Monitoring

- Set up Sentry for error tracking
- Configure AWS CloudWatch or similar for server monitoring
- Set up uptimerobot.com for availability monitoring

### Maintenance

1. Regular updates:

```bash
git pull
npm install
npm run build
pm2 restart connect
```

2. Database maintenance:

```bash
# Optimize database
psql -U connect_user -d connect -c "VACUUM ANALYZE;"
```

3. Check logs:

```bash
pm2 logs connect
```

## Troubleshooting

### Common Issues

1. **Database connection issues**: Check PostgreSQL is running and credentials are correct.

2. **Authentication errors**: Verify NEXTAUTH_SECRET and NEXTAUTH_URL are set correctly.

3. **Upload failures**: Check S3 credentials and bucket permissions.

### Support

For additional support, contact the development team at support@example.com.

## Security Checklist

- [ ] All environment variables properly set
- [ ] Database credentials secure
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] CSRF protection enabled
- [ ] Media upload validation working
- [ ] Regular backups confirmed

## Rollback Procedure

In case of deployment issues:

1. Revert to previous version:

```bash
git checkout <previous-commit>
npm install
npm run build
pm2 restart connect
```

2. Restore database if needed:

```bash
pg_restore -U connect_user -d connect path/to/backup.sql
``` 