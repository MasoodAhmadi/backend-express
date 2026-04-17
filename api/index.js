const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
// const posts = require("./routes/posts");
const users = require("../routes/users");
const events = require('../routes/events');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Vercel Express API!' });
});
app.use("/api/users", users);
app.use("/api/events", events);
// app.use("/api/posts", posts);

// MongoDB connection (reuse existing connection)
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}

// Wrap all routes with DB connection
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Export handler
module.exports = app;
module.exports.handler = serverless(app);