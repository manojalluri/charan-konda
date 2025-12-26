const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const count = await Product.countDocuments();
        console.log(`Product count: ${count}`);
        if (count === 0) {
            console.log("No products found. You might need to add some via Admin Panel.");
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
