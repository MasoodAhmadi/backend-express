const connectDB = require("../lib/db");
const Player = require("../models/Player");

// Fields available to public visitors.
// Email and phone are deliberately excluded.
const PUBLIC_FIELDS =
    "name jerseyNumber city role photo age battingStyle bowlingStyle matches runs wickets centuries description status createdAt";

// Fields available to superadmin.
const ADMIN_FIELDS = "+email +phone";

// CREATE PLAYER
exports.createPlayer = async (req, res) => {
    try {
        const { name, email, phone, city, role, jerseyNumber } = req.body;

        if (!name?.trim() || !email?.trim() || !phone?.trim() || !city?.trim() || !role?.trim() || jerseyNumber === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name, email, role, jerseyNumber, phone and city are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = phone.trim();

        const existingPlayer = await Player.findOne({
            $or: [
                { email: normalizedEmail },
                { phone: normalizedPhone },
            ],
        });

        if (existingPlayer) {
            return res.status(409).json({
                success: false,
                message: "This email or phone number is already registered",
            });
        }

        const player = await Player.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            city: city.trim(),
            role: role.trim(),
            jerseyNumber: jerseyNumber,
            status: "Pending",
        });

        return res.status(201).json({
            success: true,
            message: "Registration submitted successfully. Waiting for approval.",
            data: {
                _id: player._id,
                name: player.name,
                city: player.city,
                status: player.status,
            },
        });
    } catch (error) {
        console.error("Player registration error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This email or phone number is already registered",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to register player",
        });
    }
};

// PUBLIC: GET ALL PLAYERS
exports.getAllPlayers = async (req, res) => {
    try {
        await connectDB();

        const players = await Player.find()
            .select(PUBLIC_FIELDS)
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: players.length,
            data: players,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch players.",
        });
    }
};

// SUPERADMIN: GET ALL PLAYER DETAILS
exports.getAllPlayersAdmin = async (req, res) => {
    try {
        await connectDB();

        const players = await Player.find()
            .select(`${PUBLIC_FIELDS} ${ADMIN_FIELDS}`)
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: players.length,
            data: players,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch player management data.",
        });
    }
};

// PUBLIC: GET SINGLE PLAYER
exports.getSinglePlayer = async (req, res) => {
    try {
        await connectDB();

        const player = await Player.findById(req.params.id)
            .select(PUBLIC_FIELDS)
            .lean();

        if (!player) {
            return res.status(404).json({
                success: false,
                message: "Player not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: player,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch player.",
        });
    }
};

// SUPERADMIN: UPDATE PLAYER
exports.updatePlayer = async (req, res) => {
    try {
        await connectDB();

        const allowedFields = [
            "name",
            "email",
            "phone",
            "jerseyNumber",
            "city",
            "role",
            "photo",
            "age",
            "battingStyle",
            "bowlingStyle",
            "matches",
            "runs",
            "wickets",
            "centuries",
            "description",
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        if (updateData.name !== undefined) {
            updateData.name = updateData.name.trim();
        }

        if (updateData.email !== undefined) {
            updateData.email = updateData.email.trim().toLowerCase();
        }

        if (updateData.phone !== undefined) {
            updateData.phone = updateData.phone.trim();
        }

        const updatedPlayer = await Player.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            },
        ).select(PUBLIC_FIELDS);

        if (!updatedPlayer) {
            return res.status(404).json({
                success: false,
                message: "Player not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Player updated successfully.",
            data: updatedPlayer,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email or phone number already exists.",
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update player.",
        });
    }
};

// SUPERADMIN: APPROVE OR REJECT PLAYER
exports.updatePlayerStatus = async (req, res) => {
    try {
        await connectDB();

        const { status } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid player status.",
            });
        }

        const player = await Player.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true,
            },
        ).select(PUBLIC_FIELDS);

        if (!player) {
            return res.status(404).json({
                success: false,
                message: "Player not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Player ${status.toLowerCase()} successfully.`,
            data: player,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update player status.",
        });
    }
};

// SUPERADMIN: DELETE PLAYER
exports.deletePlayer = async (req, res) => {
    try {
        await connectDB();

        const deletedPlayer = await Player.findByIdAndDelete(req.params.id);

        if (!deletedPlayer) {
            return res.status(404).json({
                success: false,
                message: "Player not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Player deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete player.",
        });
    }
};
