const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const compression = require('compression');

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const Setting = require('./models/Setting');
const User = require('./models/User');
const Contact = require('./models/Contact');

dotenv.config({ path: path.resolve(__dirname, '.env') });

// --- DEBUGGING LOGS ---
console.log("--- SERVER STARTING ---");

// Validate Environment Variables
if (!process.env.MONGODB_URI) {
    console.error('❌ FATAL ERROR: MONGODB_URI is missing!');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/', (req, res) => res.json({ status: 'API is running' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
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
        let user = phone ? await User.findOne({ phone }) : await User.findOne({ email });
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
        const products = await Product.find()
            .select('name price category image stock rating description cuts')
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

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        if (!orderData.id || !orderData.user_email) {
            return res.status(400).json({ message: "Missing required order fields" });
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
        res.status(201).json(order);
    } catch (err) {
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
