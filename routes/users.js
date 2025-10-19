// // routes/users.js
// const express = require("express");
// const router = express.Router();
// const { getUsers, getUserById, createUser } = require("../controllers/userController");

// // GET /api/users → return all users
// router.get("/", getUsers);

// // GET /api/users/:id → return a single user
// router.get("/:id", getUserById);

// // POST /api/users → create a new user
// router.post("/", createUser);

// module.exports = router;

module.exports = (req, res) => { res.json({ msg: "Hello" }); };

