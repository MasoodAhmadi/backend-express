// routes/matchRoutes.js

const express = require("express");
const router = express.Router();

const {
    createMatch,
    getAllMatches,
    getSingleMatch,
    updateMatch,
    deleteMatch,
} = require("../controllers/matchController");


// CREATE
router.post("/", createMatch);

// GET ALL
router.get("/", getAllMatches);

// GET SINGLE
router.get("/:id", getSingleMatch);

// UPDATE
router.put("/:id", updateMatch);

// DELETE
router.delete("/:id", deleteMatch);

module.exports = router;