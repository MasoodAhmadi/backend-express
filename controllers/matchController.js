// controllers/matchController.js

const Match = require("../models/Match");


// CREATE MATCH
exports.createMatch = async (req, res) => {
    try {
        const match = new Match(req.body);

        const savedMatch = await match.save();

        res.status(201).json({
            success: true,
            message: "Match created successfully",
            data: savedMatch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create match",
            error: error.message,
        });
    }
};


// GET ALL MATCHES
exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch matches",
            error: error.message,
        });
    }
};


// GET SINGLE MATCH
exports.getSingleMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({
                success: false,
                message: "Match not found",
            });
        }

        res.status(200).json({
            success: true,
            data: match,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch match",
            error: error.message,
        });
    }
};


// UPDATE MATCH
exports.updateMatch = async (req, res) => {
    try {
        const updatedMatch = await Match.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            },
        );

        if (!updatedMatch) {
            return res.status(404).json({
                success: false,
                message: "Match not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Match updated successfully",
            data: updatedMatch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update match",
            error: error.message,
        });
    }
};


// DELETE MATCH
exports.deleteMatch = async (req, res) => {
    try {
        const deletedMatch = await Match.findByIdAndDelete(req.params.id);

        if (!deletedMatch) {
            return res.status(404).json({
                success: false,
                message: "Match not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Match deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete match",
            error: error.message,
        });
    }
};