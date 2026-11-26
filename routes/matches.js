const express = require("express");
const router = express.Router();

const {
    createMatch,
    getAllMatches,
    getSingleMatch,
    updateMatch,
    deleteMatch
} = require("../controllers/matchController");

const adminAuth = require("../middleware/auth");

// GET routes
router.get("/", getAllMatches);
router.get("/:id", getSingleMatch);

// ADMIN ONLY routes
router.post("/", adminAuth, createMatch);
router.put("/:id", adminAuth, updateMatch);
router.delete("/:id", adminAuth, deleteMatch);

module.exports = router;