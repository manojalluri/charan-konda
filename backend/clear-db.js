const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing!');
    process.exit(1);
}

const clearData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB...");

        // Define simple models for clearing
        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const Contact = mongoose.model('Contact', new mongoose.Schema({}, { strict: false }));

        console.log("Clearing Products...");
        await Product.deleteMany({});

        console.log("Clearing Orders...");
        await Order.deleteMany({});

        console.log("Clearing Contacts...");
        await Contact.deleteMany({});

        console.log("Database cleared successfully! All sample/old data removed.");
        process.exit(0);
    } catch (err) {
        console.error("Error clearing database:", err);
        process.exit(1);
    }
};

clearData();
