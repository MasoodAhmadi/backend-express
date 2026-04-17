const connectDB = require("../lib/db");
const Event = require("../models/Event");

// Public: Get all events
exports.getEvents = async (req, res) => {
    try {
        await connectDB();
        const events = await Event.find()
            .populate("organizer", "name email")
            .sort({ date: 1 });

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Create event
exports.createEvent = async (req, res) => {
    try {
        await connectDB();

        const event = await Event.create({
            ...req.body,
            organizer: req.user.id,
        });

        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Admin: Update event
exports.updateEvent = async (req, res) => {
    try {
        await connectDB();

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Admin: Delete event
exports.deleteEvent = async (req, res) => {
    try {
        await connectDB();

        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};