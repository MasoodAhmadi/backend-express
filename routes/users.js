// routes/users.js
const express = require("express");
const router = express.Router();
const { getUsers, getUserById, createUser, loginUser, updateUserRole } = require("../controllers/userController");

// GET /api/users → return all users
router.get("/", getUsers);

// GET /api/users/:id → return a single user
router.get(":id", getUserById);

// POST /api/users → create a new user
router.post("/", createUser);

// POST /api/users/login → authenticate existing user
router.post("/login", loginUser);

// PATCH /api/users/:id/role → update a user's role
router.patch(":id/role", updateUserRole);

module.exports = router;
