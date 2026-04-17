const express = require('express');
const app = express();
const cors = require("cors");

const users = require("./routes/users");
const connectDB = require('./lib/db');
const events = require('./routes/events');
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/users", users);
app.use("/api/events", events);
// app.use("/api/posts", posts);


app.use("/", (req, res) => {
    res.send("Hello World!");
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});