const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const posts = require("./routes/posts");
const users = require("./routes/users");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", users);
app.use("/api/posts", posts);

module.exports = serverless(app);
