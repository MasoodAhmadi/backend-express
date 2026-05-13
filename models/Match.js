// models/Match.js

const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    flag: {
        type: String,
        required: true,
    },

    score: {
        type: String,
        required: true,
    },
});

const MatchSchema = new mongoose.Schema(
    {
        format: {
            type: String,
            required: true,
        },

        team1: {
            type: TeamSchema,
            required: true,
        },

        team2: {
            type: TeamSchema,
            required: true,
        },

        winner: {
            type: String,
            required: true,
        },

        result: {
            type: String,
            required: true,
        },

        venue: {
            type: String,
            required: true,
        },

        date: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Match", MatchSchema);