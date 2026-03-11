// controllers/userController.js
const connectDB = require("../lib/db");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET /api/users
exports.getUsers = async (req, res) => {
    try {
        await connectDB();
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        await connectDB();
        const user = await User.findById(req.params.id).select("name email -_id");
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

        // hash password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ name, email, password: hashedPassword });

        // only return name and email
        res.status(201).json({ name: user.name, email: user.email });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST /api/users/login
exports.loginUser = async (req, res) => {
    try {
        await connectDB();
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({ name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
