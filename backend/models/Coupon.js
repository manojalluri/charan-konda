const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['Percentage', 'Flat'], required: true },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number }, // For percentage based discounts
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    description: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);
