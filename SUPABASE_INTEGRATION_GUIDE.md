# Cutora Fishes - Supabase Integration Guide

## ✅ COMPLETED SETUP

### 1. Supabase Database & RLS
- ✅ Enabled Row Level Security on 20 tables
- ✅ Created 50+ RLS policies for security
- ✅ Project ID: `ajfcqmnxnqotydevehxd`
- ✅ Database: PostgreSQL

### 2. Service Layer
- ✅ `/src/lib/supabase.js` - Main Supabase client
- ✅ `/src/lib/services/productService.js` - Product management with real-time sync

## 📋 REMAINING FILES TO CREATE

### Services (src/lib/services/)

1. **orderService.js** - Order CRUD + real-time updates
2. **cartService.js** - Shopping cart operations
3. **authService.js** - Authentication (sign up, login, logout)
4. **analyticsService.js** - Event tracking
5. **index.js** - Export all services

### Context Providers (src/context/)

1. **AdminContext.jsx** - Admin dashboard state with real-time updates
2. **CustomerContext.jsx** - Customer app state with real-time updates

### Configuration

1. Update `.env.local` with Supabase credentials
2. Update `src/main.jsx` to wrap app with context providers

## 🚀 QUICK START

### Step 1: Environment Variables
Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://ajfcqmnxnqotydevehxd.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js
```

### Step 3: Create Remaining Service Files

Each service file should follow this pattern:
```javascript
import { supabase } from '../supabase';

export const serviceName = {
  async functionName() {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .select();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  
  subscribeToChanges(callback) {
    return supabase
      .channel('public:table_name')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'table_name' }, callback)
      .subscribe();
  }
};
```

## 📊 ARCHITECTURE

```
Customer App (Vite + React)
├── Dashboard
└── Supabase Client
    ├── Products (Real-time)
    ├── Orders (Real-time)
    ├── Cart Items (Real-time)
    └── User Auth

Admin Panel  
├── Product Management
├── Order Management  
├── Analytics
└── Supabase Client
    └── All CRUD operations + real-time
```

## 🔄 REAL-TIME SYNC FLOW

1. **Admin updates product** → Supabase database
2. **Database triggers change event** → All subscribed clients
3. **Customer app receives update** → UI automatically updates

## 🛡️ SECURITY

- RLS policies enforce user-specific data access
- Admins can manage all data
- Customers can only view products + their own orders/cart
- Soft deletes for products (is_active flag)

## 📝 SERVICE EXAMPLES

### Product Service Usage
```javascript
import { productService } from '../lib/services/productService';

// Get active products
const products = await productService.getActiveProducts();

// Admin: Create product
await productService.createProduct({
  name: 'Fresh Fish',
  price: 500,
  category: 'seafood'
});

// Real-time subscription
const subscription = productService.subscribeToProducts((payload) => {
  console.log('Product changed:', payload);
});
```

## 🧪 TESTING

1. Test product creation in admin
2. Verify customer app shows updated products in real-time
3. Test order creation and status updates
4. Verify order history in customer account

## ⚠️ IMPORTANT NOTES

- Always handle errors in try-catch blocks
- Unsubscribe from channels when components unmount
- Use soft deletes (is_active = false) for products
- Test with real-time enabled
- Check RLS policies if you get "permission denied" errors

## 📞 SUPPORT

If you get permission denied errors:
1. Check RLS policies in Supabase dashboard
2. Verify user is authenticated
3. Check admin_users table for admin role

If real-time not working:
1. Ensure Realtime is enabled in Supabase settings
2. Check browser console for errors
3. Verify subscription pattern matches table structure
