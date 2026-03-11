const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const users = require("../routes/users")

const posts = require("../routes/posts");
const { connect } = require("mongoose");


const app = express();
connect();
app.use(cors());
app.use(express.json());

// Mount your routes
app.get("/", (req, res) => {
    res.json({ message: "API working on Vercel" });
});
app.use("/api/users", users);
app.use("/api/posts", posts);

// Export the serverless handler
module.exports = serverless(app);
