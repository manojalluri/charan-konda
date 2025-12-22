const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Boolean, default: true },
    stock_quantity: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
    image: { type: String },
    images: [{ type: String }],
    description: { type: String },
    cuts: { type: [String], default: ["Uncut", "Cut & Cleaned"] },
    rating: { type: Number, default: 4.5 },
    variants: [{
        name: String,
        price: Number,
        stock: Number
    }],
    quantityConfig: {
        "250g": { type: Boolean, default: true },
        "500g": { type: Boolean, default: true },
        "1kg": { type: Boolean, default: true },
        "custom": { type: Boolean, default: false },
        customMin: { type: Number, default: 250 },
        customMax: { type: Number, default: 5000 },
        customStep: { type: Number, default: 50 }
    },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
