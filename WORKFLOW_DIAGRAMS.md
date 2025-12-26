# 📊 Cutora Fresh - Complete Workflow Documentation

## Table of Contents
1. [Customer Workflow](#customer-workflow)
2. [Admin Workflow](#admin-workflow)
3. [System Architecture Flow](#system-architecture-flow)
4. [API Request Flow](#api-request-flow)
5. [Security Flow](#security-flow)

---

## 🛒 Customer Workflow

### Step-by-Step Customer Journey

```
START
  ↓
┌─────────────────────────────────┐
│  1. HOMEPAGE                    │
│  - View featured products       │
│  - Browse categories            │
│  - Search products              │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  2. PRODUCT BROWSING            │
│  Categories:                    │
│  • Sea Fish                     │
│  • Freshwater Fish              │
│  • Prawns & Shellfish           │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  3. PRODUCT DETAILS PAGE        │
│  Select Options:                │
│  ┌─────────────────────────┐   │
│  │ Cut Type:               │   │
│  │ ○ Uncut                 │   │
│  │ ○ Cut & Cleaned (+₹25)  │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Quantity:               │   │
│  │ [250g] [500g] [1kg]     │   │
│  │ [Custom: ___ kg]        │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Units: [1] [2] [3] [+]  │   │
│  └─────────────────────────┘   │
│  [ADD TO CART]                  │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  4. SHOPPING CART               │
│  Items:                         │
│  • Fish 1.5kg (Cut) - ₹787.50   │
│  • Prawns 500g (Uncut) - ₹300   │
│  ─────────────────────────────  │
│  Item Total:        ₹1,087.50   │
│  Delivery Fee:           ₹40    │
│  Tax (5%):              ₹54.38  │
│  Coupon (FIRST10):     -₹100    │
│  ─────────────────────────────  │
│  TOTAL TO PAY:      ₹1,081.88   │
│  [PROCEED TO CHECKOUT]          │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  5. AUTHENTICATION              │
│  Already logged in? → Skip      │
│  New user? → Register           │
│  └→ Name, Email, Phone, Pass    │
│  Existing? → Login              │
│  └→ Email/Phone + Password      │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  6. CHECKOUT                    │
│  Personal Details:              │
│  • Full Name                    │
│  • Mobile Number (10 digits)   │
│  Delivery Address:              │
│  • House/Street/Landmark        │
│  • City                         │
│  • Pincode (6 digits)           │
│  Payment: Pay on Confirmation   │
│  [PLACE ORDER]                  │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  7. ORDER PROCESSING (Backend)  │
│  ✓ Validate inputs              │
│  ✓ Generate Order ID            │
│     (Format: CF-XXXX-XXXX)      │
│  ✓ Save to MongoDB              │
│  ✓ Update coupon usage          │
│  ✓ Clear cart                   │
│  ✓ Send confirmation            │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  8. ORDER CONFIRMATION          │
│  ✅ Order Placed Successfully!  │
│  Order ID: CF-A8B2-9F3E         │
│  Estimated Delivery: Tomorrow   │
│  [TRACK ORDER] [DOWNLOAD]       │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  9. ORDER TRACKING              │
│  Status Timeline:               │
│  ✅ Confirmed                   │
│  ⏳ Processing                  │
│  🚚 Out for Delivery            │
│  📦 Delivered                   │
└─────────────────────────────────┘
  ↓
END
```

---

## 👨‍💼 Admin Workflow

### Admin Dashboard Navigation

```
┌─────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │   PRODUCTS   │  │    ORDERS    │               │
│  └──────────────┘  └──────────────┘               │
│         ↓                  ↓                        │
│  ┌──────────────┐  ┌──────────────┐               │
│  │  CUSTOMERS   │  │   COUPONS    │               │
│  └──────────────┘  └──────────────┘               │
│         ↓                  ↓                        │
│  ┌──────────────┐  ┌──────────────┐               │
│  │  ANALYTICS   │  │   SETTINGS   │               │
│  └──────────────┘  └──────────────┘               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 1. Product Management Flow

```
PRODUCTS DASHBOARD
  ↓
┌─────────────────────────────────┐
│  VIEW ALL PRODUCTS              │
│  Table with: Name, Price,       │
│  Category, Stock, Actions       │
└─────────────────────────────────┘
  ↓
  ├─→ [ADD NEW PRODUCT]
  │     ↓
  │   ┌─────────────────────────┐
  │   │ Product Form:           │
  │   │ • Name                  │
  │   │ • Price (₹/kg)          │
  │   │ • Category (dropdown)   │
  │   │ • Image URL             │
  │   │ • Description           │
  │   │ • Stock Quantity        │
  │   │ • Cuts: [Uncut][Cut]    │
  │   │ • Quantity Config:      │
  │   │   [250g][500g][1kg]     │
  │   │   [Custom: min-max]     │
  │   │ [SAVE PRODUCT]          │
  │   └─────────────────────────┘
  │     ↓
  │   Save to MongoDB → Success Message
  │
  ├─→ [EDIT PRODUCT]
  │     ↓
  │   Update fields → Save Changes
  │
  └─→ [DELETE PRODUCT]
        ↓
      Confirm → Remove from DB
```

### 2. Order Management Flow

```
ORDERS DASHBOARD
  ↓
┌─────────────────────────────────┐
│  ALL ORDERS                     │
│  Filters: Status, Date Range    │
│  Search: Order ID, Customer     │
└─────────────────────────────────┘
  ↓
Click Order → VIEW DETAILS
  ↓
┌─────────────────────────────────┐
│  ORDER DETAILS                  │
│  Order ID: CF-XXXX-XXXX         │
│  Customer: John Doe             │
│  Phone: +91 9876543210          │
│  Address: ...                   │
│  Items:                         │
│  • Fish 1kg (Cut) - ₹525        │
│  • Prawns 500g - ₹300           │
│  Total: ₹865                    │
│  ─────────────────────────────  │
│  Current Status: [Processing]   │
│  Update Status:                 │
│  [Confirmed] [Processing]       │
│  [Out for Delivery] [Delivered] │
│  ─────────────────────────────  │
│  Tracking Info:                 │
│  Tracking ID: [________]        │
│  Courier: [________]            │
│  [UPDATE]                       │
└─────────────────────────────────┘
```

### 3. Coupon Management Flow

```
COUPONS DASHBOARD
  ↓
┌─────────────────────────────────┐
│  CREATE NEW COUPON              │
│  ┌───────────────────────────┐ │
│  │ Code: [FIRST10______]     │ │
│  │ Type: ○ Percentage        │ │
│  │       ○ Fixed Amount      │ │
│  │ Value: [10___]            │ │
│  │ Min Order: [500___]       │ │
│  │ Max Discount: [100___]    │ │
│  │ Valid From: [Date____]    │ │
│  │ Valid Until: [Date____]   │ │
│  │ Usage Limit: [100___]     │ │
│  │ Active: ☑                 │ │
│  │ [CREATE COUPON]           │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
  ↓
Save to MongoDB
  ↓
Display in Coupons List
  ↓
Available for customers to use
```

---

## 🏗️ System Architecture Flow

### Complete Request-Response Cycle

```
┌─────────────────────────────────────────────────────┐
│                    USER DEVICE                      │
│              (Browser: Chrome/Safari)               │
└─────────────────────────────────────────────────────┘
                       ↓ HTTPS
                       ↓
┌─────────────────────────────────────────────────────┐
│                 FRONTEND SERVER                     │
│              (Vercel/Netlify CDN)                   │
│  ┌───────────────────────────────────────────────┐ │
│  │           React Application                   │ │
│  │  • Components (JSX)                           │ │
│  │  • Context (State Management)                 │ │
│  │  • Router (Navigation)                        │ │
│  │  • Styles (Tailwind CSS)                      │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                       ↓
                  API Request
              (REST API - JSON)
                       ↓
┌─────────────────────────────────────────────────────┐
│              SECURITY MIDDLEWARE                    │
│  ┌───────────────────────────────────────────────┐ │
│  │ 1. Rate Limiting (100 req/min per IP)        │ │
│  │ 2. CORS Validation (Whitelist check)         │ │
│  │ 3. Security Headers (XSS, CSRF protection)   │ │
│  │ 4. JWT Token Verification (if protected)     │ │
│  │ 5. Input Sanitization (Remove scripts)       │ │
│  │ 6. Input Validation (Format check)           │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                       ↓
              Request Validated ✓
                       ↓
┌─────────────────────────────────────────────────────┐
│               BACKEND API SERVER                    │
│                (Render/Railway)                     │
│  ┌───────────────────────────────────────────────┐ │
│  │           Express.js Application              │ │
│  │                                               │ │
│  │  Routes:                                      │ │
│  │  • /api/products    → Product Controller     │ │
│  │  • /api/orders      → Order Controller       │ │
│  │  • /api/auth        → Auth Controller        │ │
│  │  • /api/coupons     → Coupon Controller      │ │
│  │  • /api/users       → User Controller        │ │
│  │                                               │ │
│  │  Middleware:                                  │ │
│  │  • authenticate()   → Verify JWT             │ │
│  │  • adminOnly()      → Check role             │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                       ↓
              Database Query
                       ↓
┌─────────────────────────────────────────────────────┐
│              MongoDB ATLAS DATABASE                 │
│  ┌───────────────────────────────────────────────┐ │
│  │  Collections:                                 │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ products                                │ │ │
│  │  │ • name, price, category, image          │ │ │
│  │  │ • stock, cuts, quantityConfig           │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ orders                                  │ │ │
│  │  │ • id, customer, items, total            │ │ │
│  │  │ • status, tracking, payment             │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ users                                   │ │ │
│  │  │ • name, email, phone, password (hash)   │ │ │
│  │  │ • role (user/admin/owner)               │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ coupons                                 │ │ │
│  │  │ • code, type, value, validity           │ │ │
│  │  │ • minOrder, usageLimit, usageCount      │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                       ↓
              Data Retrieved
                       ↓
              Format as JSON
                       ↓
┌─────────────────────────────────────────────────────┐
│                  RESPONSE                           │
│  {                                                  │
│    "success": true,                                 │
│    "data": [...],                                   │
│    "message": "Success"                             │
│  }                                                  │
│  + Security Headers                                 │
│  + Status Code (200, 201, 400, 401, 500)          │
└─────────────────────────────────────────────────────┘
                       ↓
              Back to Frontend
                       ↓
              Update UI (React)
                       ↓
              Display to User
```

---

## 🔐 Security Flow

### Request Security Pipeline

```
USER INPUT
    ↓
┌─────────────────────────────────┐
│  CLIENT-SIDE VALIDATION         │
│  • Required fields check        │
│  • Format validation (JS)       │
│  • Length limits                │
└─────────────────────────────────┘
    ↓
SEND TO SERVER
    ↓
┌─────────────────────────────────┐
│  RATE LIMITER                   │
│  Check: IP address              │
│  Limit: 100 requests/min        │
│  Action: Block if exceeded      │
│  Status: 429 Too Many Requests  │
└─────────────────────────────────┘
    ↓ PASS
┌─────────────────────────────────┐
│  CORS VALIDATION                │
│  Check: Origin header           │
│  Whitelist:                     │
│  • localhost:5173               │
│  • yourdomain.com               │
│  Action: Block if not in list   │
└─────────────────────────────────┘
    ↓ PASS
┌─────────────────────────────────┐
│  INPUT SANITIZATION             │
│  Remove:                        │
│  • <script> tags                │
│  • HTML tags                    │
│  • javascript: URLs             │
│  • Event handlers (onclick)     │
└─────────────────────────────────┘
    ↓ SANITIZED
┌─────────────────────────────────┐
│  INPUT VALIDATION               │
│  Check:                         │
│  • Email format                 │
│  • Phone (10 digits)            │
│  • Pincode (6 digits)           │
│  • Name (letters only)          │
│  • Password (min 6 chars)       │
└─────────────────────────────────┘
    ↓ VALID
┌─────────────────────────────────┐
│  JWT VERIFICATION               │
│  (For protected routes)         │
│  1. Extract token from header   │
│  2. Verify signature            │
│  3. Check expiration            │
│  4. Decode user data            │
│  Status: 401 if invalid         │
└─────────────────────────────────┘
    ↓ AUTHENTICATED
┌─────────────────────────────────┐
│  ROLE AUTHORIZATION             │
│  (For admin routes)             │
│  Check: user.role               │
│  Required: 'admin' or 'owner'   │
│  Status: 403 if forbidden       │
└─────────────────────────────────┘
    ↓ AUTHORIZED
┌─────────────────────────────────┐
│  PROCESS REQUEST                │
│  • Execute business logic       │
│  • Query database               │
│  • Format response              │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  ADD SECURITY HEADERS           │
│  • X-Content-Type-Options       │
│  • X-Frame-Options              │
│  • X-XSS-Protection             │
│  • Strict-Transport-Security    │
└─────────────────────────────────┘
    ↓
SEND RESPONSE TO CLIENT
```

---

## 📋 Quick Reference

### Customer Actions
| Action | Page | Authentication Required |
|--------|------|------------------------|
| Browse Products | `/menu` | ❌ No |
| View Product Details | `/product/:id` | ❌ No |
| Add to Cart | Any | ❌ No |
| View Cart | `/cart` | ❌ No |
| Checkout | `/checkout` | ✅ Yes (or guest) |
| Track Order | `/track-order` | ✅ Yes |
| View Orders | `/my-orders` | ✅ Yes |

### Admin Actions
| Action | Page | Role Required |
|--------|------|--------------|
| View Dashboard | `/admin` | Admin/Owner |
| Manage Products | `/admin/products` | Admin/Owner |
| Manage Orders | `/admin/orders` | Admin/Owner |
| Manage Customers | `/admin/customers` | Admin/Owner |
| Manage Coupons | `/admin/discounts` | Admin/Owner |
| View Analytics | `/admin/analytics` | Admin/Owner |
| Settings | `/admin/settings` | Owner Only |

---

## 🔄 Data Flow Summary

```
USER → FRONTEND → SECURITY → BACKEND → DATABASE
                                ↓
                        PROCESS & VALIDATE
                                ↓
DATABASE → BACKEND → SECURITY → FRONTEND → USER
```

---

**Last Updated:** December 26, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready
