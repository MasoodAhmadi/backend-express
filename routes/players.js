
const express = require("express");
const router = express.Router();

const { auth, superAdmin } = require("../middleware/auth");

const {
    createPlayer,
    getAllPlayers,
    getAllPlayersAdmin,
    getSinglePlayer,
    updatePlayer,
    deletePlayer,
    updatePlayerStatus,
} = require("../controllers/playerController");

// Superadmin routes FIRST
router.get("/admin", auth, superAdmin, getAllPlayersAdmin);
router.post("/", auth, superAdmin, createPlayer);
router.put("/:id", auth, superAdmin, updatePlayer);
router.delete("/:id", auth, superAdmin, deletePlayer);
router.patch("/:id/status", auth, superAdmin, updatePlayerStatus);

// Public routes
router.get("/", getAllPlayers);
router.get("/:id", getSinglePlayer);

module.exports = router;
