# 🔒 Security Guidelines for Cutora Fresh

## Environment Variables

All sensitive credentials and API keys are stored in environment variables and should NEVER be committed to version control.

### Frontend (.env)
Required environment variables for the frontend:
```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key
```

### Backend (.env)
Required environment variables for the backend:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-jwt-token-here
PORT=5000
```

### How to Set Environment Variables

#### Local Development:
1. Create a `.env` file in the root directory (frontend)
2. Create a `.env` file in the `backend` directory
3. Add the required variables (see above)
4. Never commit `.env` files to Git (they're already in .gitignore)

#### Production (Render/Vercel/etc):
1. Go to your hosting dashboard
2. Navigate to Environment Variables section
3. Add each variable manually through the UI
4. Redeploy your application

## Security Best Practices Implemented

### ✅ Frontend Security
- [x] No hardcoded API keys or passwords
- [x] All sensitive data comes from environment variables
- [x] Production API URL not exposed in source code
- [x] Removed console.log statements that expose URLs or keys
- [x] .env files are in .gitignore
- [x] Supabase keys properly managed

### ✅ Backend Security
- [x] MongoDB URI stored in environment variables
- [x] JWT secret stored in environment variables
- [x] Password hashing using bcrypt
- [x] JWT token-based authentication
- [x] Role-based access control (admin/owner/user)
- [x] Middleware for authentication and authorization
- [x] No passwords returned in API responses
- [x] .env files protected with .gitignore

### ✅ Authentication Flow
- User passwords are hashed with bcrypt before storage
- JWT tokens are issued upon successful login
- Tokens expire after 7 days
- Protected routes require valid JWT token
- Admin routes require admin or owner role

## What NOT to Do ❌

1. **Never commit .env files**
   - Frontend .env is already in .gitignore
   - Backend .env is already in .gitignore

2. **Never hardcode credentials in source code**
   - Always use `import.meta.env.VITE_*` for frontend
   - Always use `process.env.*` for backend

3. **Never expose API keys in console.log**
   - All sensitive logs have been removed

4. **Never push sensitive data to Git**
   - Check your commits before pushing
   - Use Git history cleaning tools if accidentally committed

## Environment Variable Checklist

Before deploying to production:

- [ ] All environment variables are set in hosting platform
- [ ] .env files are NOT committed to Git
- [ ] VITE_API_BASE_URL points to production backend
- [ ] JWT_SECRET is a strong, random string
- [ ] MONGODB_URI uses secure connection string
- [ ] All API keys are valid and active
- [ ] Test authentication flow works
- [ ] Verify admin access controls

## Emergency Response

If credentials are accidentally exposed:

1. **Immediately rotate all affected credentials**
   - MongoDB: Change password and update URI
   - JWT: Change secret (will invalidate all tokens)
   - Supabase: Regenerate keys if exposed
   - EmailJS: Regenerate keys if needed

2. **Update environment variables everywhere**
   - Local .env files
   - Production hosting platform
   - Development team members

3. **Clear Git history if committed**
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env' \
   --prune-empty --tag-name-filter cat -- --all
   ```

4. **Force push to remote**
   ```bash
   git push origin --force --all
   ```

## Contact for Security Issues

If you find a security vulnerability, please report it immediately:
- Email: cutorafishes@gmail.com
- Subject: [SECURITY] Issue Description

---
Last Updated: December 26, 2025
