# Cutora Fresh - E-Commerce Platform

A full-stack e-commerce application for fresh meats and seafood with MongoDB backend integration.

## 🚀 Features

- **User Application**
  - Browse products by category
  - Add items to cart with custom quantities
  - User authentication (Register/Login)
  - Order tracking and history
  - Contact form

- **Admin Dashboard**
  - Product management (Add/Edit/Delete)
  - Order management with status updates
  - Real-time stock management
  - Site customization settings
  - Analytics and reports

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (already configured)

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

2. **Environment Variables**
   
   The backend `.env` is already configured with:
   - MongoDB connection string
   - JWT secret
   - Server port (5000)

## 🎯 Running the Application

### Option 1: Run Both Servers Separately (Recommended)

**Terminal 1 - Backend Server:**
```bash
npm run server
```
This starts the Express backend on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
This starts the Vite dev server on `http://localhost:5173`

### Option 2: Database Seeding (Optional)

To populate the database with sample products:
```bash
node backend/seed.js
```

## 🗄️ Database Schema

### Collections

1. **products**
   - name, category, price, stock
   - images, variants, quantityConfig
   - status (Active/Inactive)

2. **orders**
   - user_id, user_email
   - items, customer details
   - status, tracking info
   - timestamps

3. **users**
   - name, email, password (hashed)
   - role (customer/admin/owner)

4. **settings**
   - site_config (logo, hero, branding)

5. **contacts**
   - name, contact, requirement

## 🔐 Admin Access

To create an admin user, you can either:

1. **Register normally and update the role in MongoDB:**
   - Register a new account
   - In MongoDB Atlas, find the user in `users` collection
   - Change `role` from `customer` to `admin` or `owner`

2. **Use the API directly:**
   ```javascript
   POST http://localhost:5000/api/auth/register
   {
     "name": "Admin User",
     "email": "admin@cutora.com",
     "password": "your-secure-password"
   }
   ```
   Then update the role in the database.

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders?email=...&userId=...` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (admin)

### Settings
- `GET /api/settings/:id` - Get settings
- `POST /api/settings` - Update settings (admin)

### Contact
- `POST /api/contact` - Submit contact form

## 🔄 Synchronization

All modules are now fully synchronized between admin and user applications:

- ✅ Product updates reflect immediately in the store
- ✅ Stock changes sync in real-time
- ✅ Orders are visible to both users and admins
- ✅ Site settings apply across the application

## 📱 Features in Detail

### Product Management
- Support for multiple images per product
- Custom quantity configurations (250g, 500g, 1kg, custom)
- Product variants (size, cut types)
- Stock status tracking

### Order Management
- Order status updates (Pending, Processing, Shipped, Delivered)
- Tracking ID and courier partner info
- Cash on Delivery support
- Order history for users

### User Features
- Cart persistence in localStorage
- Responsive design for mobile/tablet/desktop
- Product filtering by category
- Preparation type selection (Uncut, Cut & Clean)

## 🚨 Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct
- Ensure port 5000 is not in use

### Products not loading
- Verify backend is running on port 5000
- Check browser console for API errors
- Run the seed script to add sample data

### Authentication issues
- Clear localStorage and try again
- Check JWT token expiration

## 📝 Development Notes

- Frontend runs on port 5173 (Vite default)
- Backend runs on port 5000
- MongoDB uses the connection string from `.env`
- Images are stored as base64 in the database (for demo purposes)

## 🔮 Future Enhancements

- [ ] Image upload to cloud storage (AWS S3/Cloudinary)
- [ ] Email notifications on order status changes
- [ ] Payment gateway integration
- [ ] Admin analytics dashboard
- [ ] Inventory management alerts
- [ ] Customer reviews and ratings

## 📄 License

This project is private and proprietary.

## 👥 Support

For issues or questions, contact the development team.

---

**Current Status:** ✅ Fully Operational with MongoDB Integration
