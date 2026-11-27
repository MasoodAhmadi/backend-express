
const connectDB = require("../lib/db");
const Player = require("../models/Player");

// CREATE PLAYER
exports.createPlayer = async (req, res) => {
    try {
        await connectDB();

        const { name } = req.body;

        // Validate name
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Player name is required",
            });
        }

        const playerName = name.trim();

        // Check for duplicate name (case-insensitive)
        const existingPlayer = await Player.findOne({
            name: {
                $regex: `^${playerName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
            },
        });

        if (existingPlayer) {
            return res.status(409).json({
                success: false,
                message: "A player with this name already exists!",
            });
        }

        // Create player
        const player = await Player.create({
            ...req.body,
            name: playerName,
            status: "Pending",
        });

        res.status(201).json({
            success: true,
            message: "Player created successfully",
            data: player,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create player",
            error: error.message,
        });
    }
};


// GET ALL PLAYERS
exports.getAllPlayers = async (req, res) => {
    try {
        await connectDB();

        const players = await Player.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: players.length,
            data: players,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// GET SINGLE PLAYER
exports.getSinglePlayer = async (req, res) => {
    try {
        await connectDB();

        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({
                success: false,
                message: "Player not found",
            });
        }

        res.status(200).json({
            success: true,
            data: player,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch player",
            error: error.message,
        });
    }
};


// UPDATE PLAYER
exports.updatePlayer = async (req, res) => {
    try {
        await connectDB();

        const updatedPlayer = await Player.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedPlayer) {
            return res.status(404).json({
                success: false,
                message: "Player not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Player updated successfully",
            data: updatedPlayer,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update player",
            error: error.message,
        });
    }
};

// APPROVE OR REJECT PLAYER
exports.updatePlayerStatus = async (req, res) => {
    try {
        await connectDB();

        const { status } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid player status",
            });
        }

        const player = await Player.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!player) {
            return res.status(404).json({
                success: false,
                message: "Player not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `Player ${status.toLowerCase()} successfully`,
            data: player,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update player status",
            error: error.message,
        });
    }
};

// DELETE PLAYER
exports.deletePlayer = async (req, res) => {
    try {
        await connectDB();

        const deletedPlayer = await Player.findByIdAndDelete(
            req.params.id
        );

        if (!deletedPlayer) {
            return res.status(404).json({
                success: false,
                message: "Player not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Player deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete player",
            error: error.message,
        });
    }
};
