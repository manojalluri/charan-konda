const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' }, // customer, admin, owner
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
