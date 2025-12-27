# 🔧 CORS Error Fix Guide

## What is CORS?

**CORS = Cross-Origin Resource Sharing**

### Simple Explanation 🎯

Imagine your **Frontend** (website) and **Backend** (API server) are two different houses:
- Frontend lives at: `http://localhost:5173`
- Backend lives at: `http://localhost:5000` (or Render URL)

When Frontend tries to talk to Backend, the browser asks:
> "Hey Backend, is Frontend allowed to talk to you?"

If Backend says **"No"** → You get **CORS Error** ❌  
If Backend says **"Yes"** → Everything works ✅

---

## Why Did This Happen?

We added **strict security** to protect your API. Now the backend only talks to **trusted websites**.

**Before Fix:**
- Backend was open to anyone (insecure) ⚠️

**After Fix:**
- Backend only talks to whitelisted origins (secure) ✅
- Problem: Your dev URL wasn't in the list!

---

## ✅ What We Fixed

### Updated CORS Configuration

**Development Mode (NODE_ENV !== 'production'):**
- ✅ Allows **ALL** localhost origins automatically
- ✅ Allows **ALL** 127.0.0.1 origins automatically
- ✅ No need to manually add every port
- ✅ Perfect for local development

**Production Mode (NODE_ENV === 'production'):**
- ✅ Only allows whitelisted origins
- ✅ Secure and protected
- ✅ No unauthorized access

---

## 🚀 How to Use

### Development (Local Machine)

**1. Start Backend:**
```bash
cd backend
node server.js
```
You should see:
```
--- SERVER STARTING ---
✅ MongoDB Connected
✅ Server running on port 5000
```

**2. Start Frontend:**
```bash
npm run dev
```
You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

**3. Test It:**
- Open `http://localhost:5173` in your browser
- Try browsing products
- Check browser console - **NO CORS errors!** ✅

**Backend will show:**
```
✅ CORS: Allowed (dev mode) - http://localhost:5173
```

---

### Production Deployment

**1. Set Environment Variable:**

In your hosting platform (Render/Railway), add:
```
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**2. Backend Will:**
- ✅ Block all localhost origins (security)
- ✅ Only allow production URLs
- ✅ Show logs if blocked:
  ```
  ❌ CORS Error: Blocked origin http://localhost:5173
  ✅ Allowed origins: ['https://yourdomain.com']
  ```

---

## 🔍 Troubleshooting

### Problem 1: Still Getting CORS Error

**Check:**
1. Is backend running? → `http://localhost:5000` should respond
2. Is NODE_ENV set? → Should be empty or 'development' locally
3. What's the error message in browser console?

**Solution:**
```bash
# In backend directory
echo $env:NODE_ENV    # Should be empty or 'development'

# If it's 'production', unset it:
$env:NODE_ENV=""
```

---

### Problem 2: CORS Error Only on Specific Page

**Cause:** Frontend is making API request to wrong URL

**Check in `src/lib/api.js`:**
```javascript
// Make sure VITE_API_BASE_URL is set correctly
const url = import.meta.env.VITE_API_BASE_URL;
// Should be: http://localhost:5000/api (development)
```

**Fix in `.env`:**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Problem 3: Works Locally but Not in Production

**Cause:** Production frontend URL not in whitelist

**Fix on Backend (.env):**
```
ALLOWED_ORIGINS=https://cutora.vercel.app,https://your-custom-domain.com
```

**Or update `server.js` directly:**
```javascript
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4173',
    'https://cutora.vercel.app',
    'https://YOUR-PRODUCTION-URL.vercel.app',  // Add your URL here
];
```

---

## 📝 Environment Variables Checklist

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:5000/api  # Development
# VITE_API_BASE_URL=https://your-api.onrender.com/api  # Production
```

### Backend (.env)
```bash
# Development - Leave NODE_ENV empty or set to 'development'
NODE_ENV=development

# Production - Set when deploying
# NODE_ENV=production
# ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 🎯 Quick Test

### Test CORS is Working:

**1. Open Browser Console (F12)**

**2. Try this in Console:**
```javascript
fetch('http://localhost:5000/api/products')
  .then(res => res.json())
  .then(data => console.log('✅ CORS Working!', data))
  .catch(err => console.error('❌ CORS Error:', err));
```

**3. Expected Result:**
```
✅ CORS Working! [{...products...}]
```

**If you see this instead:**
```
❌ CORS Error: Failed to fetch
```
Then backend is not running or CORS is still blocked.

---

## 🔒 Security Notes

### Why We Do This

**Without CORS Protection:**
- ❌ Any website can steal your data
- ❌ Hackers can access your API
- ❌ No control over who uses your backend

**With CORS Protection:**
- ✅ Only YOUR frontend can access backend
- ✅ Unauthorized websites are blocked
- ✅ Full control over access

### Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| CORS | Flexible (all localhost) | Strict (whitelist only) |
| Security | Lower (convenience) | Maximum (protection) |
| Logging | Verbose | Minimal |
| Purpose | Easy testing | Secure deployment |

---

## 📞 Common Questions

**Q: Can I just disable CORS?**  
A: **NO!** That would make your API completely insecure. Anyone could steal your data.

**Q: Why not just allow all origins in production?**  
A: That defeats the purpose of security. Only your frontend should access your backend.

**Q: What if I have multiple frontend domains?**  
A: Add them all to `ALLOWED_ORIGINS` environment variable:
```
ALLOWED_ORIGINS=https://site1.com,https://site2.com,https://site3.com
```

**Q: How do I know which origin is being blocked?**  
A: Check the backend console logs. It will show:
```
❌ CORS Error: Blocked origin http://some-site.com
✅ Allowed origins: [...]
```

---

## 🔄 Updated Files

- ✅ `backend/server.js` - CORS configuration fixed
- ✅ `CORS_FIX_GUIDE.md` - This documentation

---

## 🎉 Summary

**What Changed:**
1. ✅ Development mode now allows ALL localhost origins
2. ✅ Production mode stays strictly secure
3. ✅ Better logging to debug CORS issues
4. ✅ No manual configuration needed for local dev

**How to Use:**
1. Start backend: `node backend/server.js`
2. Start frontend: `npm run dev`
3. Everything works! ✅

**No more CORS errors in development!** 🎊

---

**Last Updated:** December 26, 2025  
**Status:** ✅ FIXED
