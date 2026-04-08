const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
const posts = require("./routes/posts");
const users = require("./routes/users");
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
app.use("/api/posts", posts);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Export handler
module.exports = app;
module.exports.handler = serverless(app);