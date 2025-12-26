const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env");
    process.exit(1);
}

const createAdminUser = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB...");

        // Admin credentials from env
        const adminData = {
            name: process.env.ADMIN_NAME || "Admin",
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: "owner"
        };

        if (!adminData.email || !adminData.password) {
            console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env");
            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log("\nAdmin Credentials:");
            console.log("Email:", adminData.email);
            console.log("Password: Use the password configured in .env");
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
        console.log("Email:    " + adminData.email);
        console.log("Password: Use the password configured in .env");
        console.log("Role:     " + adminData.role);
        console.log("========================================");
        console.log("\nYou can now login at: /admin/login");

        await mongoose.connection.close();
    } catch (err) {
        console.error("Error creating admin:", err.message);
        process.exit(1);
    }
};

createAdminUser();
