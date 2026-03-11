const mongoose = require("mongoose");
const dotenv = require('dotenv');
const dns = require('node:dns');

dotenv.config();


async function connectDB() {

    // Override DNS resolution
    const originalLookup = dns.lookup;
    dns.lookup = (hostname, options, callback) => {
        // console.log(`DNS lookup for: ${hostname}`);
        return originalLookup(hostname, options, callback);
    };

    // Set DNS servers
    dns.setServers(['8.8.8.8', '1.1.1.1']);

    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cricket';

    console.log('Connecting to MongoDB...');

    mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000
    })
        .then(() => {
            console.log('✅ Connected to MongoDB');

        })
        .catch((error) => {
            console.log('❌ Error connecting:', error.message);
            process.exit(1);
        });
}

module.exports = connectDB;



