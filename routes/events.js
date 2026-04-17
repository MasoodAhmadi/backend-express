const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const auth = require("../middleware/auth");

// Routes
router.get("/", eventController.getEvents);
router.post("/", auth, eventController.createEvent);
router.delete("/:id", eventController.deleteEvent);

// ✅ IMPORTANT: export router (not object)
module.exports = router;