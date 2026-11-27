
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
    {


        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [
                /^\+?\d{7,15}$/,
                "Please enter a valid phone number",
            ],
        },
        jerseyNumber: {
            type: Number,
            required: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            enum: [
                "Batter",
                "Bowler",
                "All-rounder",
                "Wicketkeeper",
            ],
            default: null,
        },

        photo: {
            type: String,
            default: "",
        },

        age: {
            type: Number,
            required: true,
            min: 1,
        },

        battingStyle: {
            type: String,
            default: "",
        },

        bowlingStyle: {
            type: String,
            default: "",
        },

        matches: {
            type: Number,
            default: 0,
            min: 0,
        },

        runs: {
            type: Number,
            default: 0,
            min: 0,
        },

        wickets: {
            type: Number,
            default: 0,
            min: 0,
        },

        centuries: {
            type: Number,
            default: 0,
            min: 0,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Player", playerSchema);
