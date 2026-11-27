
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

router.post("/", createPlayer);

router.get("/", getAllPlayers);

router.get("/:id", getSinglePlayer);

router.put("/:id", updatePlayer);

router.delete("/:id", deletePlayer);

router.patch(
    "/:id/status",
    auth,
    superAdmin,
    updatePlayerStatus
);
module.exports = router;