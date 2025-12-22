const mongoose = require('mongoose');
const Product = require('./models/Product');
const { products } = require('../src/data/mockData'); // This might fail if using ESM in mockData
// Note: mockData.js is likely ESM, so we might need to copy the data or use a different approach.

// Hardcoded mock data snippet for seeding
const initialProducts = [
    {
        name: "Premium Goat Curry Cut",
        category: "Goat",
        price: 650,
        stock: true,
        stock_quantity: 45,
        status: "Active",
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800",
        description: "Fresh, tender goat meat cut into perfect curry pieces.",
        quantityConfig: { "250g": true, "500g": true, "1kg": true, "custom": false }
    },
    {
        name: "Fresh Sea Bass (Sea Bass)",
        category: "Sea Fish",
        price: 450,
        stock: true,
        stock_quantity: 20,
        status: "Active",
        image: "https://images.unsplash.com/photo-1534604973900-c41ab46d073e?w=800",
        description: "Freshly caught sea bass, rich in Omega-3.",
        quantityConfig: { "250g": true, "500g": true, "1kg": true, "custom": true, customMin: 500, customMax: 5000, customStep: 500 }
    }
    // Add more if needed
];

const MONGODB_URI = "mongodb+srv://CUTORA:Manoj%402006@cluster0.po1tmgh.mongodb.net/?appName=Cluster0";

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        await Product.deleteMany({});
        await Product.insertMany(initialProducts);

        console.log("Database seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedDB();
