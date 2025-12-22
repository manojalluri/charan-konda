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
    final_amount: Number,
    tracking_id: String,
    courier_partner: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
