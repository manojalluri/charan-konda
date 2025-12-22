const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://CUTORA:Manoj%402006@cluster0.po1tmgh.mongodb.net/?appName=Cluster0";

const testConnection = async () => {
    try {
        console.log("Testing MongoDB connection...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Successfully connected to MongoDB!");

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("\n📦 Available collections:");
        collections.forEach(col => console.log(`  - ${col.name}`));

        // Count documents in each collection
        console.log("\n📊 Document counts:");
        const Product = require('./models/Product');
        const Order = require('./models/Order');
        const User = require('./models/User');

        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const userCount = await User.countDocuments();

        console.log(`  Products: ${productCount}`);
        console.log(`  Orders: ${orderCount}`);
        console.log(`  Users: ${userCount}`);

        console.log("\n✅ Database is ready!");
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error("❌ Connection failed:", err.message);
        process.exit(1);
    }
};

testConnection();
