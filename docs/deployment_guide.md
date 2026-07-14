# Production Deployment Guide

This document describes the deployment architecture, hosting steps, reverse proxy configurations, and release workflows for the SaaS Billing & Shop Management System.

All deployment configurations adhere to the rules defined in the **[Project Rules](file:///d:/personal/billing-saas/docs/project_rules.md)**.

---

## 1. Hosting Architecture Overview

The system uses three main hosting providers to separate concerns and ensure cost-efficient scalability:

* **Frontend Hosting (Vercel)**: Standard static React site deployment with global Edge routing and CDN caching.
* **Backend Hosting (Railway / Dockerized VPS)**: Deploying NestJS container clusters with auto-scaling capabilities.
* **Database & Caching (Supabase & Managed Redis)**: PostgreSQL instances with connection pooling enabled, paired with Redis clusters for queue management.

---

## 2. Infrastructure Setup & Configuration

### 2.1 Domain & DNS Configuration (Cloudflare)
Cloudflare is used for DNS management, SSL termination, and WAF protection.

* **DNS Records**:
  * Root domain mapping: `billing-saas.com` -> Vercel CNAME
  * App subdomain routing: `app.billing-saas.com` -> Vercel CNAME
  * API backend mapping: `api.billing-saas.com` -> Railway/VPS LB Target
* **Cloudflare Security Profile**:
  * SSL/TLS Mode: **Full (Strict)**
  * Enable **WAF Rules** to block common SQL injection and XSS patterns at the edge.
  * Enable **HTTP Strict Transport Security (HSTS)**.

---

### 2.2 Nginx Reverse Proxy Setup (VPS Deployments)
For VPS-based production deployments, configure Nginx as a reverse proxy in front of the NestJS Docker container:

```nginx
# /etc/nginx/sites-available/api.billing-saas.com

upstream nestjs_api {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name api.billing-saas.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.billing-saas.com;

    ssl_certificate /etc/letsencrypt/live/api.billing-saas.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.billing-saas.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location / {
        proxy_pass http://nestjs_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout Settings
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

### 2.3 Docker Deployment Configuration
For production packaging, the NestJS backend uses a multi-stage Docker build to keep images lightweight:

```dockerfile
# Stage 1: Build dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production execution environment
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "dist/src/main"]
```

---

## 3. Continuous Integration & Deployment (GitHub Actions)

We use GitHub Actions to automate linting, testing, and deployment:

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy API

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Railway Deploy Webhook
        run: |
          curl -X POST "${{ secrets.RAILWAY_DEPLOY_WEBHOOK_URL }}"
```

---

## 4. Production Runlist Checklist

1. **Database Migration**: Run `npx prisma migrate deploy` to sync schema modifications before updating API routes.
2. **Env Verification**: Confirm all values (such as Stripe API keys, Brevo SMTP configurations, and database credentials) are set correctly in the environments.
3. **Queue Health**: Verify Redis connection pooling counts and verify that BullMQ workers can process background tasks successfully.
4. **CORS Validation**: Confirm backend configurations restrict incoming origins to `https://app.billing-saas.com`.
