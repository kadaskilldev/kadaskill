# Security Policy

## Overview

This document outlines the security policies, best practices, and vulnerability reporting procedures for the KadaSkill platform.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

We provide security updates for the latest major version only.

---

## Reporting a Vulnerability

### How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

**Email**: security@kadaskill.com

**Include**:
- Type of vulnerability
- Full paths of affected source files
- Location of affected code (tag/branch/commit)
- Step-by-step instructions to reproduce
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies by severity (see below)

### Severity Levels

| Severity | Response Time | Fix Timeline |
|----------|--------------|--------------|
| **Critical** | 24 hours | 1-3 days |
| **High** | 48 hours | 1 week |
| **Medium** | 7 days | 2 weeks |
| **Low** | 14 days | 1 month |

---

## Security Architecture

### Authentication

**Mechanism**: JWT-based authentication via Supabase

**Features**:
- Secure password hashing (bcrypt)
- Email verification
- OAuth 2.0 support (Google, Microsoft, Facebook, LinkedIn)
- Session management
- Automatic token refresh

**Best Practices**:
- Passwords must be minimum 6 characters (recommend 12+)
- Sessions expire after 7 days of inactivity
- Tokens stored in httpOnly cookies (future implementation)

### Authorization

**Mechanism**: Row Level Security (RLS) via PostgreSQL

**Policies**:
```sql
-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admin-only operations
CREATE POLICY "Admins can manage all data"
    ON courses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );
```

**Admin Access**:
- Admin flag stored in `profiles.is_admin`
- RLS policies enforce admin-only operations
- Frontend checks are UX only (not security boundary)

### Data Protection

**Encryption**:
- ✅ All data in transit encrypted via HTTPS/TLS 1.3
- ✅ Database encrypted at rest (Supabase)
- ✅ Password hashing via bcrypt (Supabase Auth)
- ✅ JWT tokens for session management

**Personal Data**:
- Email addresses
- Full names
- Profile pictures
- Learning progress

**Data Retention**:
- User data retained until account deletion
- Session data cleared on logout
- Logs retained for 90 days

### API Security

**Supabase Keys**:
- **Anon Key**: Safe for client-side use (public)
- **Service Role Key**: Server-only, never exposed to client

**Rate Limiting**:
- Supabase enforces rate limits (500 req/min on free tier)
- Custom rate limiting can be added

**CORS**:
- Configured in Supabase dashboard
- Only whitelisted domains allowed

---

## Security Best Practices

### For Developers

#### 1. Never Expose Secrets

```javascript
// ❌ BAD - Hardcoded secrets
const SECRET_KEY = 'my-secret-key-12345';

// ✅ GOOD - Use environment variables
const SECRET_KEY = process.env.SECRET_KEY;
```

**Never commit**:
- API keys
- Database credentials
- Service role keys
- OAuth secrets
- `.env` files

#### 2. Validate User Input

```javascript
// ❌ BAD - No validation
function updateUsername(username) {
    supabase.from('profiles').update({ username });
}

// ✅ GOOD - Validate input
function updateUsername(username) {
    // Validate format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        throw new Error('Invalid username format');
    }

    // Sanitize (if needed)
    const sanitized = username.trim().toLowerCase();

    // Update
    return supabase.from('profiles').update({ username: sanitized });
}
```

#### 3. Prevent XSS

```javascript
// ❌ BAD - Direct HTML injection
element.innerHTML = userInput;

// ✅ GOOD - Use textContent
element.textContent = userInput;

// ✅ GOOD - Sanitize HTML if needed
element.innerHTML = DOMPurify.sanitize(userInput);
```

#### 4. Use Parameterized Queries

Supabase automatically uses parameterized queries, preventing SQL injection:

```javascript
// ✅ Automatically safe
const { data } = await supabase
    .from('users')
    .select('*')
    .eq('username', userInput); // Safe - parameterized
```

#### 5. Implement CSRF Protection

For forms that modify data:

```html
<!-- Add CSRF token -->
<input type="hidden" name="csrf_token" value="{{ csrf_token }}">
```

**Note**: Supabase JWT tokens provide built-in CSRF protection.

#### 6. Secure File Uploads

```javascript
// Validate file type
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
}

// Validate file size (5MB max)
if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large');
}

// Generate unique filename
const fileExt = file.name.split('.').pop();
const fileName = `${userId}_${Date.now()}.${fileExt}`;
```

#### 7. Implement Content Security Policy

```html
<meta http-equiv="Content-Security-Policy"
    content="default-src 'self';
             script-src 'self' https://cdn.jsdelivr.net;
             style-src 'self' 'unsafe-inline';
             img-src 'self' https://*.supabase.co;
             connect-src 'self' https://*.supabase.co;">
```

---

### For Users

#### Strong Passwords

- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Use password manager
- Never reuse passwords

#### Two-Factor Authentication (Future)

Coming soon:
- SMS verification
- Authenticator app support

#### Recognize Phishing

- Verify email sender
- Check for HTTPS
- Don't click suspicious links
- KadaSkill will never ask for password via email

---

## Known Security Considerations

### Current Limitations

1. **No Rate Limiting (Application-Level)**
   - Currently relies on Supabase rate limits
   - **Mitigation**: Plan to add custom rate limiting

2. **No Two-Factor Authentication**
   - Not yet implemented
   - **Mitigation**: Planned for v1.1

3. **SessionStorage for State**
   - Less secure than httpOnly cookies
   - **Mitigation**: Plan to migrate to httpOnly cookies

4. **No Content Security Policy**
   - Not enforced in HTML headers
   - **Mitigation**: Add CSP headers in deployment

### Addressed Security Issues

- ✅ SQL Injection (prevented by Supabase parameterized queries)
- ✅ XSS (textContent used, no direct innerHTML with user input)
- ✅ CSRF (JWT-based auth)
- ✅ Unauthorized access (RLS policies)
- ✅ Password security (bcrypt hashing via Supabase)

---

## Security Checklist

### Deployment Security

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Service role key not exposed to client
- [ ] RLS policies enabled on all tables
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error messages don't expose sensitive data
- [ ] Database backups enabled
- [ ] Logging and monitoring set up

### Code Security

- [ ] No hardcoded secrets
- [ ] Input validation implemented
- [ ] Output encoding implemented
- [ ] Authentication required for protected routes
- [ ] Authorization checks in place
- [ ] File upload validation
- [ ] Error handling doesn't leak information

### Infrastructure Security

- [ ] Database encrypted at rest
- [ ] TLS/SSL for all connections
- [ ] Firewall configured
- [ ] Regular security updates applied
- [ ] Access logs monitored

---

## Incident Response Plan

### 1. Detection

**Monitoring**:
- Supabase dashboard for unusual activity
- Error logs for security-related errors
- User reports

### 2. Assessment

- Determine severity (Critical, High, Medium, Low)
- Identify affected systems and data
- Estimate number of affected users

### 3. Containment

- **Immediate**: Disable affected feature/endpoint
- **Short-term**: Apply temporary patch
- **Long-term**: Develop permanent fix

### 4. Eradication

- Remove vulnerability from all systems
- Update dependencies if needed
- Patch all affected versions

### 5. Recovery

- Restore normal operations
- Monitor for recurrence
- Verify fix effectiveness

### 6. Post-Incident

- Document incident
- Update security policies
- Notify affected users (if applicable)
- Publish security advisory

---

## Compliance

### Data Protection Regulations

**GDPR Compliance** (for EU users):
- Right to access data
- Right to delete data
- Data portability
- Clear privacy policy

**Implementation**:
- User profile export feature
- Account deletion feature
- Privacy policy page
- Cookie consent (future)

### Security Standards

Following best practices from:
- OWASP Top 10
- CWE/SANS Top 25
- NIST Cybersecurity Framework

---

## Security Updates

### Staying Informed

- Watch [GitHub repository](https://github.com/your-org/kadaskill) for security advisories
- Subscribe to security mailing list: security-announce@kadaskill.com
- Check [CHANGELOG.md](./CHANGELOG.md) for security fixes

### Applying Updates

```bash
# Check for updates
git fetch origin
git log --oneline origin/main..main

# Apply security patches
git pull origin main
bun install  # Update dependencies
bun run dev  # Test locally
```

---

## Third-Party Dependencies

### Dependency Management

**Automated Scanning**:
- Dependabot (GitHub)
- `bun audit` for vulnerability checks

**Update Policy**:
- Security patches: Applied immediately
- Minor updates: Weekly
- Major updates: Monthly (with testing)

**Current Dependencies**:
- Express.js 4.18.2
- Supabase JS v2
- Chart.js 4.4.0
- SortableJS 1.15.0

---

## Security Contact

**General Security Inquiries**: security@kadaskill.com

**Vulnerability Reports**: security@kadaskill.com (confidential)

**Response Time**: Within 48 hours

---

## Additional Resources

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API security details
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Security architecture
- [Supabase Security](https://supabase.com/docs/guides/platform/security) - Backend security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web security risks

---

**Last Updated**: 2025-12-18
**Version**: 1.0.0

**Security is a shared responsibility. Thank you for helping keep KadaSkill secure!** 🔒
