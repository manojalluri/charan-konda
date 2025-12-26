# 👑 Admin User Management Guide

## How to Create the First Admin User

We have a built-in script to create your initial admin/owner account safely.

### 1. Open Terminal
Navigate to the `backend` folder:
```bash
cd backend
```

### 2. Run the Creation Script
```bash
node create-admin.js
```

### 3. What Happens
- The script checks if an admin already exists.
- If not, it creates a new user with **Owner** privileges.
- **Credentials:** Uses the variables configured in your `backend/.env` file (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

---

## 🔐 How to Add More Admin Users

Once you have logged in with the initial admin account:

1. **Login** to the Admin Panel (`/admin/login`)
2. Go to **Settings** or **Admin Users** section (if enabled in UI)
3. If UI management is not available yet, you can use the API or database directly:

### Option A: Using API (Postman/Curl)

**Endpoint:** `POST /api/auth/register`
**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@cutora.com",
  "phone": "9876543210",
  "password": "StrongPassword123"
}
```

**Note:** This creates a standard user. You need to verify if the UI allows role promotion. If not, use Option B.

### Option B: Using MongoDB Directly (Recommended for Developers)

1. Open your MongoDB Compass or Atlas Dashboard
2. Find the `users` collection
3. Find the user you want to promote
4. Edit the document
5. Change `"role": "user"` to `"role": "admin"` or `"role": "owner"`
6. Click **Update**

---

## 🛡️ Role Definitions

| Role | Permissions |
|------|-------------|
| **User** | Can buy products, view their own orders |
| **Admin** | Can manage products, orders, customers, coupons |
| **Owner** | All Admin access + Site Settings & Financial Data |

---

## ⚠️ Security Warning

- **Change the default admin password** immediately after first login!
- Do not share admin credentials.
- Create separate accounts for each staff member.
