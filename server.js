// // server.js
// const app = require("./app");

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
const app = require("./api/index.js"); // optional: for dev only
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
