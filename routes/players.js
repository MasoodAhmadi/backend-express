const express = require("express");
const router = express.Router();

const { auth, superAdmin } = require("../middleware/auth");

const {
    createPlayer,
    getAllPlayers,
    getSinglePlayer,
    updatePlayer,
    deletePlayer,
    updatePlayerStatus,
} = require("../controllers/playerController");

// Anyone can view players
router.get("/", getAllPlayers);
router.get("/:id", getSinglePlayer);

// Only superadmin can manage players
router.post("/", auth, superAdmin, createPlayer);
router.put("/:id", auth, superAdmin, updatePlayer);
router.delete("/:id", auth, superAdmin, deletePlayer);

router.patch("/:id/status", auth, superAdmin, updatePlayerStatus);

module.exports = router;