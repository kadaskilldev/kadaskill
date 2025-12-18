# KadaSkill Deployment Guide

## Overview

This guide covers deploying KadaSkill to production environments.

---

## Prerequisites

- Supabase project set up
- Domain name (optional but recommended)
- Git repository
- Hosting platform account (Vercel, Netlify, or traditional hosting)

---

## Environment Configuration

### 1. Environment Variables

Create `.env` file (if using Node.js backend in future):

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only

# Server
PORT=3000
NODE_ENV=production

# Domain
DOMAIN=https://your domain.com
```

**Important**: Never commit `.env` to version control. Add to `.gitignore`.

### 2. Update Supabase Configuration

**Option 1**: Environment variables (recommended for production)

```javascript
// public/js/script.js
const SUPABASE_URL = process.env.SUPABASE_URL || 'fallback-url';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'fallback-key';
```

**Option 2**: Keep hardcoded (current setup) - works for static hosting

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Advantages**:
- Zero-config deployment
- Automatic SSL
- Global CDN
- Serverless functions support
- Free tier available

**Steps**:

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd kadaskill
vercel
```

4. **Follow prompts**:
   - Set up and deploy: Y
   - Scope: Your account
   - Link to existing project: N
   - Project name: kadaskill
   - Directory: ./
   - Build command: (leave empty for static)
   - Output directory: public

5. **Production deployment**:
```bash
vercel --prod
```

**Configure** `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

### Option 2: Netlify

**Steps**:

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Login**:
```bash
netlify login
```

3. **Initialize**:
```bash
netlify init
```

4. **Deploy**:
```bash
netlify deploy --prod
```

**Configure** `netlify.toml`:
```toml
[build]
  command = "echo 'No build needed'"
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: Traditional Hosting (VPS)

**Requirements**:
- Ubuntu/Debian server
- Node.js or Bun installed
- Nginx or Apache
- SSL certificate (Let's Encrypt)

**Steps**:

1. **SSH into server**:
```bash
ssh user@your-server-ip
```

2. **Install Node.js/Bun**:
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or Bun
curl -fsSL https://bun.sh/install | bash
```

3. **Clone repository**:
```bash
git clone https://github.com/your-org/kadaskill.git
cd kadaskill
```

4. **Install dependencies**:
```bash
bun install
# or npm install
```

5. **Set up PM2 (process manager)**:
```bash
npm install -g pm2
pm2 start server.js --name kadaskill
pm2 save
pm2 startup
```

6. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

7. **Install SSL with Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Database Migration

### 1. Set Up Production Database

1. **Go to Supabase Dashboard**
2. **Create production project** (separate from dev)
3. **Run migrations** in SQL Editor:

```sql
-- Execute in order:
-- 1. database-schema.sql
-- 2. seed-courses.sql
-- 3. seed-certifications.sql
-- 4. seed-badges.sql
-- 5. seed-practice.sql
-- 6. seed-lessons.sql
```

4. **Create storage bucket**:
   - Name: `profile-pictures`
   - Make public
   - Set up CORS

### 2. Configure RLS Policies

Verify Row Level Security policies are active:

```sql
-- Check policies
SELECT * FROM pg_policies;

-- Ensure RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

---

## Post-Deployment Checklist

### Security

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Service role key not exposed to client
- [ ] RLS policies active on all tables
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (Supabase)

### Performance

- [ ] Static assets served from CDN
- [ ] Images optimized
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] Database indexes created

### Monitoring

- [ ] Error tracking set up (Sentry)
- [ ] Analytics installed (Google Analytics)
- [ ] Uptime monitoring configured
- [ ] Database backups automated
- [ ] Log aggregation set up

### Testing

- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Database operations function
- [ ] File uploads work
- [ ] Test on mobile devices
- [ ] Cross-browser testing complete

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Rollback Strategy

### Vercel/Netlify

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Traditional Hosting

```bash
# Keep multiple versions
/var/www/kadaskill-v1.0
/var/www/kadaskill-v1.1

# Symlink to current
ln -sfn /var/www/kadaskill-v1.1 /var/www/kadaskill

# Rollback
ln -sfn /var/www/kadaskill-v1.0 /var/www/kadaskill
sudo systemctl restart kadaskill
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check server status
curl -I https://yourdomain.com

# Check database connection
# In Supabase dashboard → Settings → API
```

### Log Monitoring

```bash
# PM2 logs
pm2 logs kadaskill

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backups

Supabase provides automatic backups. Verify:
- Daily backups enabled
- Retention period set
- Test restoration process

---

## Performance Optimization

### CDN Configuration

- Use Vercel/Netlify edge network
- Or configure CloudFlare for static assets

### Caching Strategy

```nginx
# Nginx caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);

-- Refresh materialized views
SELECT refresh_leaderboard();
```

---

## Troubleshooting

### Common Issues

**Issue**: 404 on page refresh
**Solution**: Configure rewrites in hosting platform

**Issue**: CORS errors
**Solution**: Configure Supabase CORS settings

**Issue**: Slow database queries
**Solution**: Add indexes, optimize queries

**Issue**: High server load
**Solution**: Enable caching, use CDN, scale vertically/horizontally

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [SECURITY.md](./SECURITY.md) - Security best practices

---

**Last Updated**: 2025-12-18
**Version**: 1.0.0
