// lib/db.js
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config(); // ← must be called before using process.env

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = db.connections[0].readyState;
        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw new Error("Database connection failed");
    }
}

module.exports = connectDB;
