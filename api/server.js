// api/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Vercel Express API!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Export as serverless function
module.exports = app;
module.exports.handler = serverless(app);