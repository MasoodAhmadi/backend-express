// controllers/userController.js
const connectDB = require("../lib/db");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET /api/users
exports.getUsers = async (req, res) => {
    try {
        await connectDB();
        const users = await User.find().select("name email role createdAt updatedAt");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        await connectDB();
        const user = await User.findById(req.params.id).select("name email role -_id");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// controllers/userController.js
exports.createUser = async (req, res) => {
    try {
        await connectDB();

        let { name, email, phone, city, password, role } = req.body;

        // Remove spaces and dashes from phone number
        phone = phone.replace(/[\s-]/g, "");

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password || "default123", saltRounds);

        const user = await User.create({
            name,
            email,
            phone,
            city,
            password: hashedPassword,
            role: role || "player",
        });

        res.status(201).json({
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            role: user.role,
        });
    } catch (err) {
        console.error("Create user error:", err);
        res.status(400).json({ message: err.message });
    }
};

// PATCH /api/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        await connectDB();
        const { role } = req.body;
        if (!role || !["player", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'player' or 'admin'." });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = role;
        await user.save();

        res.json({ name: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        await connectDB();

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Soft delete: mark deleted_at timestamp
        user.deleted_at = user.deleted_at ? null : new Date();
        await user.save();

        res.json({
            message: user.deleted_at
                ? "User deleted successfully"
                : "User restored successfully",
            deleted_at: user.deleted_at,
        });

        // ---- Optional: Hard delete instead of soft delete ----
        // await User.findByIdAndDelete(req.params.id);
        // res.json({ message: "User permanently deleted" });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/users/login
exports.loginUser = async (req, res) => {
    try {
        await connectDB(); // uses cached connection

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

        // optional: include JWT here if you want auth
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ name: user.name, email: user.email, role: user.role });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
