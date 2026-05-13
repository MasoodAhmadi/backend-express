// models/Match.js

const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        flag: {
            type: String,
            required: true,
            trim: true,
        },

        score: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    },
);

const MatchSchema = new mongoose.Schema(
    {
        format: {
            type: String,
            required: true,
            trim: true,
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
            trim: true,
        },

        result: {
            type: String,
            required: true,
            trim: true,
        },

        venue: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Match", MatchSchema);