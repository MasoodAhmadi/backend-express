const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const users = require("../routes/users"); // adjust path
const posts = require("../routes/posts");

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/users", users);
app.use("/api/posts", posts);

// Export as serverless function
module.exports = serverless(app);
