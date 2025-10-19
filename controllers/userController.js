// controllers/userController.js
const connectDB = require("../lib/db");
const User = require("../models/User");

// GET /api/users
exports.getUsers = async (req, res) => {
    res.json({ msg: "Hello" });
    // try {
    //     await connectDB();
    //     const users = await User.find();
    //     res.json(users);
    // } catch (err) {
    //     res.status(500).json({ message: err.message });
    // }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        await connectDB();
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/users
exports.createUser = async (req, res) => {
    try {
        await connectDB();
        const { name, email, password } = req.body;

        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
