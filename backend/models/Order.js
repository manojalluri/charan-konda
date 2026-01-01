const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    user_id: { type: String },
    user_email: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    items: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        quantityInKg: Number,
        category: String,
        cut: String,
        image: String
    }],
    customer: {
        name: String,
        phone: String,
        address: String,
        city: String,
        pincode: String,
        email: String
    },
    item_total: Number,
    delivery_fee: Number,
    taxes_and_charges: Number,
    discount: { type: Number, default: 0 },
    coupon_code: String,
    final_amount: Number,
    tracking_id: String,
    courier_partner: String,
    payment_method: { type: String, default: 'COD' },
    payment_status: { type: String, default: 'Pending' },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

orderSchema.index({ user_id: 1 });
orderSchema.index({ user_email: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
