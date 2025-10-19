// // server.js
// const app = require("./app");

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
    res.send('Hello World!');
});

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3000');
});