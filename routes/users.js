const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const superAdmin = require("../middleware/auth");

router.post("/login", userController.loginUser);

// Logged-in users can view ordinary users
router.get("/", auth, userController.getUsers);
router.get("/:id", auth, userController.getUserById);

// Only superadmin can manage users
router.post("/", auth, superAdmin, userController.createUser);
router.put("/:id", auth, superAdmin, userController.updateUser);
router.delete("/:id", auth, superAdmin, userController.deleteUser);

module.exports = router;