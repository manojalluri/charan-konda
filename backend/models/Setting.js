const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Setting', settingSchema);
