const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://CUTORA:Manoj%402006@cluster0.po1tmgh.mongodb.net/?appName=Cluster0";

const createAdminUser = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB...");

        // Admin credentials
        const adminData = {
            name: "Admin",
            email: "admin@cutora.com",
            password: "Admin@2006",
            role: "owner"
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log("\nAdmin Credentials:");
            console.log("Email:", adminData.email);
            console.log("Password: Admin@2006");
            await mongoose.connection.close();
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Create admin user
        const admin = new User({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            role: adminData.role
        });

        await admin.save();

        console.log("✅ Admin user created successfully!");
        console.log("\n========================================");
        console.log("     ADMIN LOGIN CREDENTIALS");
        console.log("========================================");
        console.log("Email:    admin@cutora.com");
        console.log("Password: Admin@2006");
        console.log("Role:     owner");
        console.log("========================================");
        console.log("\nYou can now login at: http://localhost:5173/admin/login");

        await mongoose.connection.close();
    } catch (err) {
        console.error("Error creating admin:", err.message);
        process.exit(1);
    }
};

createAdminUser();
