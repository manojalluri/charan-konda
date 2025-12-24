const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const Setting = require('./models/Setting');
const User = require('./models/User');
const Contact = require('./models/Contact');

dotenv.config({ path: path.resolve(__dirname, '.env') });

// --- DEBUGGING LOGS (View these in Render Logs) ---
console.log("--- SERVER STARTING ---");
console.log("Current Directory:", __dirname);
console.log("Environment Keys Available:", Object.keys(process.env));
console.log("MONGODB_URI is set:", !!process.env.MONGODB_URI);
console.log("JWT_SECRET is set:", !!process.env.JWT_SECRET);
console.log("-----------------------");

// Validate Environment Variables
if (!process.env.MONGODB_URI) {
    console.error('❌ FATAL ERROR: MONGODB_URI is missing!');
    console.error('👉 ACTION REQUIRED: Go to Render Dashboard -> Environment -> Add MONGODB_URI');
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL ERROR: JWT_SECRET is missing!');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/', (req, res) => res.json({ status: 'API is running' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

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

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation
        if (!phone || !password || !name) {
            return res.status(400).json({ message: 'Name, Phone and Password are required.' });
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
        const { phone, email, password } = req.body;

        // Support both phone (new) and email (admin/legacy)
        let user;
        if (phone) {
            user = await User.findOne({ phone });
        } else if (email) {
            user = await User.findOne({ email });
        }

        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PRODUCT ROUTES ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ name: 1 });
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
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/products/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
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

        // If not admin, strictly enforce user isolation
        if (req.user.role !== 'admin' && req.user.role !== 'owner') {
            // Regular users can ONLY see their own orders
            // We use the ID from the token for security, not just the query param
            query.user_id = req.user.id;
        } else {
            // Admins can filter by email/userId or see all
            if (email) query.user_email = email;
            if (userId) query.user_id = userId;
        }

        const orders = await Order.find(query).sort({ created_at: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;

        // Basic validation
        if (!orderData.id || !orderData.user_email) {
            return res.status(400).json({ message: "Missing required order fields" });
        }

        // Security check: If a token is provided, ensure user_id matches
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // If user is logged in, their order MUST be linked to their account
                orderData.user_id = decoded.id;
            } catch (err) {
                // Invalid token - optionally allow guest or reject
            }
        }

        const order = new Order(orderData);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error("Order Save Error:", err);
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/orders/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/orders/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Order.findOneAndDelete({ id: req.params.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- CONTACT ROUTES ---
app.get('/api/contact', authenticate, adminOnly, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ created_at: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- SETTINGS ROUTES ---
app.get('/api/settings/:id', async (req, res) => {
    try {
        const setting = await Setting.findOne({ id: req.params.id });
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
