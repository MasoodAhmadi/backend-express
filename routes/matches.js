const express = require("express");
const router = express.Router();

const {
    createMatch,
    getAllMatches,
    getSingleMatch,
    updateMatch,
    deleteMatch
} = require("../controllers/matchController");

const { superAdmin } = require("../middleware/auth");

// GET routes
router.get("/", getAllMatches);
router.get("/:id", getSingleMatch);

// ADMIN ONLY routes
router.post("/", superAdmin, createMatch);
router.put("/:id", superAdmin, updateMatch);
router.delete("/:id", superAdmin, deleteMatch);

module.exports = router;