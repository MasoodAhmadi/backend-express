const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const users = require("../routes/users")

const posts = require("../routes/posts");


const app = express();
app.use(cors());
app.use(express.json());

// Mount your routes
app.use("/api/users", users);
app.use("/api/posts", posts);

// Export the serverless handler
module.exports = serverless(app);
