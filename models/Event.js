const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Event description is required"],
        },
        date: {
            type: Date,
            required: [true, "Event date is required"],
        },
        startTime: {
            type: String,
            required: [true, "Start time is required"],
        },
        endTime: {
            type: String,
            required: [true, "End time is required"],
        },
        location: {
            name: {
                type: String,
                required: [true, "Location name is required"],
            },
            address: {
                type: String,
                required: [true, "Address is required"],
            },
            city: {
                type: String,
                required: [true, "City is required"],
                default: "Tampere",
            },
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        maxParticipants: {
            type: Number,
            default: 22,
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
        },
        eventType: {
            type: String,
            enum: ["match", "training", "tournament", "meeting"],
            default: "match",
        },
        image: {
            type: String,
        },
        isPublic: {
            type: Boolean,
            default: true, // Publicly visible
        },
    },
    { timestamps: true }
);

// Prevent model overwrite in serverless environments (e.g., Vercel)
module.exports =
    mongoose.models.Event || mongoose.model("Event", eventSchema);