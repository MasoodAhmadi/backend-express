const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const users = require("./routes/users");
const connectDB = require('./lib/db');

connectDB();

app.use(express.json());

app.use("/api/users", users);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});