const express = require('express');
// Server configuration for Cutora Fresh v2.0
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss');

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const Setting = require('./models/Setting');
const User = require('./models/User');
const Contact = require('./models/Contact');
const Coupon = require('./models/Coupon');
const axios = require('axios');
const Razorpay = require('razorpay');

// --- HELPERS ---
const sendSMS = async (phone, message) => {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
        console.warn('⚠️ SMS NOT SENT: FAST2SMS_API_KEY is missing in .env');
        return;
    }

    // Clean phone number (remove +91 or spaces)
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    try {
        const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
            params: {
                authorization: apiKey,
                message: message,
                language: 'english',
                route: 'q',
                numbers: cleanPhone,
            }
        });
        return response.data;
    } catch (error) {
        console.error('❌ SMS Gateway Error:', error.response?.data || error.message);
    }
};

// --- SERVER INIT ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIGURATION ---
dotenv.config({ path: path.resolve(__dirname, '.env') });

// CORS Configuration - SECURITY IMPROVEMENT
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4173',
    'https://charan-konda.vercel.app',
    'https://cutora.vercel.app',
    // Add your production frontend URL here
];

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(helmet());

// Improved Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiter to all api routes
app.use('/api/', limiter);

// Strict CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(express.json({
    limit: '10mb',
    // Sanitize every request body to prevent XSS
    verify: (req, res, buf) => {
        if (req.body && typeof req.body === 'object') {
            const sanitize = (obj) => {
                for (let key in obj) {
                    if (typeof obj[key] === 'string') {
                        obj[key] = xss(obj[key]);
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        sanitize(obj[key]);
                    }
                }
            };
            // Note: express.json() hasn't parsed the body yet in verify.
            // But we can do it in a middleware instead for better clarity.
        }
    }
}));

// Simple XSS Sanitization Middleware
app.use((req, res, next) => {
    if (req.body) {
        const sanitize = (obj) => {
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = xss(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitize(obj[key]);
                }
            }
        };
        sanitize(req.body);
    }
    next();
});

// --- DEBUGGING LOGS ---
console.log("--- SERVER STARTING ---");

// Validate Environment Variables
if (!process.env.MONGODB_URI) {
    console.error('❌ FATAL ERROR: MONGODB_URI is missing!');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL ERROR: JWT_SECRET is missing!');
    process.exit(1);
}

// Health Check
app.get('/', (req, res) => res.json({ status: 'API is running' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// --- RAZORPAY INITIALIZATION ---
let razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        console.log('✅ Razorpay Initialized');
    } else {
        console.warn('⚠️ Razorpay keys missing in .env');
    }
} catch (error) {
    console.error('❌ Razorpay Initialization Error:', error);
}

// Input Sanitization Helper
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim().replace(/[<>]/g, '');
    }
    return input;
};

// --- MIDDLEWARE ---
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'owner')) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// --- COUPON ROUTES ---
app.get('/api/coupons', authenticate, adminOnly, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ created_at: -1 });
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/coupons', authenticate, adminOnly, async (req, res) => {
    try {
        const { code } = req.body;
        const exist = await Coupon.findOne({ code });
        if (exist) return res.status(400).json({ message: 'Coupon code already exists' });

        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/coupons/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(coupon);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/coupons/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/coupons/verify', async (req, res) => {
    try {
        const { code, amount } = req.body;

        // Input validation
        if (!code || typeof code !== 'string') {
            return res.status(400).json({ message: 'Invalid coupon code' });
        }
        if (!amount || typeof amount !== 'number' || amount < 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) return res.status(404).json({ message: 'Invalid or expired coupon' });

        // Check Date
        const now = new Date();
        if (new Date(coupon.validFrom) > now) return res.status(400).json({ message: 'Coupon not yet valid' });
        if (coupon.validUntil && new Date(coupon.validUntil) < now) return res.status(400).json({ message: 'Coupon expired' });

        // Check Usage Limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });

        // Check Min Order
        if (coupon.minOrder && amount < coupon.minOrder) return res.status(400).json({ message: `Minimum order of ₹${coupon.minOrder} required` });

        // Calculate Discount
        let discount = 0;
        if (coupon.type === 'Percentage') {
            discount = (amount * coupon.value) / 100;
            if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
            discount = coupon.value;
        }

        res.json({ success: true, discount: Math.round(discount), couponCode: coupon.code, couponId: coupon._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// --- MIDDLEWARE ---


// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    try {
        let { name, email, phone, password } = req.body;

        // Sanitize inputs
        name = sanitizeInput(name);
        email = sanitizeInput(email);
        phone = sanitizeInput(phone);

        // Validation
        if (!phone || !password || !name) {
            return res.status(400).json({ message: 'Name, Phone and Password are required.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Phone number must be 10 digits.' });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) return res.status(400).json({ message: 'User with this phone number already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, phone, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name, email, phone, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        let { phone, email, password } = req.body;

        // Sanitize inputs
        phone = sanitizeInput(phone);
        email = sanitizeInput(email);

        let user = phone ? await User.findOne({ phone }) : await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PRODUCT ROUTES ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find()
            .select('name price category image stock stock_quantity status rating description cuts variants quantityConfig readyToCookPrice')
            .sort({ name: 1 })
            .lean();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/products', authenticate, adminOnly, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/products/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/products/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ORDER ROUTES ---
app.get('/api/orders', authenticate, async (req, res) => {
    try {
        const { email, userId } = req.query;
        let query = {};
        if (req.user.role !== 'admin' && req.user.role !== 'owner') {
            query.user_id = req.user.id;
        } else {
            if (email) query.user_email = email;
            if (userId) query.user_id = userId;
        }
        const orders = await Order.find(query).sort({ created_at: -1 }).lean();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ id: req.params.id }).lean();
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;

        // Validate required fields
        if (!orderData.id || !orderData.user_email) {
            return res.status(400).json({ message: "Missing required order fields" });
        }

        // Validate order items
        if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item" });
        }

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                orderData.user_id = decoded.id;
            } catch (err) { }
        }
        const order = new Order(orderData);
        await order.save();

        if (orderData.coupon_code) {
            await Coupon.findOneAndUpdate(
                { code: orderData.coupon_code },
                { $inc: { usageCount: 1 } }
            );
        }

        // --- SEND ORDER SMS ---
        if (order.customer && order.customer.phone) {
            const smsMessage = `Hi ${order.customer.name}, your order ${order.id} is confirmed! Track your fresh catch here: https://cutora.vercel.app/#/track-order?id=${order.id} - Cutora Fresh`;
            sendSMS(order.customer.phone, smsMessage);
        }

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/orders/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const oldOrder = await Order.findOne({ id: req.params.id });
        const order = await Order.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // --- SEND UPDATE SMS ---
        if (order.customer && order.customer.phone) {
            let message = '';

            // Case 1: Tracking ID added or changed
            if (req.body.tracking_id && req.body.tracking_id !== oldOrder.tracking_id) {
                message = `Hi ${order.customer.name}, your order ${order.id} has been dispatched! Courier: ${order.courier_partner || 'Surface'}. Tracking ID: ${order.tracking_id}. Track: https://cutora.vercel.app/#/track-order?id=${order.id}`;
            }
            // Case 2: Status changed
            else if (req.body.status && req.body.status !== oldOrder.status) {
                message = `Hi ${order.customer.name}, your order ${order.id} status is now: ${order.status}. Track: https://cutora.vercel.app/#/track-order?id=${order.id}`;
            }

            if (message) {
                sendSMS(order.customer.phone, message);
            }
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/orders/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const orderId = req.params.id;
        let order = await Order.findOneAndDelete({ id: orderId });
        if (!order && mongoose.Types.ObjectId.isValid(orderId)) {
            order = await Order.findOneAndDelete({ _id: orderId });
        }
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ success: true, message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- USER MANAGEMENT ROUTES ---
app.get('/api/users', authenticate, adminOnly, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ created_at: -1 }).lean();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/users/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- CONTACT ROUTES ---
app.get('/api/contact', authenticate, adminOnly, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ created_at: -1 }).lean();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        let { name, phone, email, requirement } = req.body;

        // Sanitize inputs
        name = sanitizeInput(name);
        phone = sanitizeInput(phone);
        email = sanitizeInput(email);
        requirement = sanitizeInput(requirement);

        const contact = new Contact({ name, phone, email, requirement });
        await contact.save();
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- SETTINGS ROUTES ---
app.get('/api/settings/:id', async (req, res) => {
    try {
        const setting = await Setting.findOne({ id: req.params.id }).lean();
        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/settings', authenticate, adminOnly, async (req, res) => {
    try {
        const { id, value } = req.body;
        const setting = await Setting.findOneAndUpdate(
            { id },
            { value, updated_at: Date.now() },
            { upsert: true, new: true }
        );
        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PAYMENT ROUTES (Razorpay) ---
app.post('/api/payments/create-order', async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(500).json({ message: 'Payment gateway not configured' });
        }

        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(201).json(order);
    } catch (err) {
        console.error('❌ Razorpay Order Error:', err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/payments/verify', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment details' });
        }

        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            res.json({ success: true, message: 'Payment verified' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (err) {
        console.error('❌ Payment Verification Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
