const connectDB = require("../lib/db");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ORDINARY_ROLES = ["user",];

// GET /api/users
// Return ordinary users only
exports.getUsers = async (req, res) => {
    try {
        await connectDB();

        const users = await User.find({
            role: { $in: ORDINARY_ROLES },
        })
            .select("name email phone city role createdAt updatedAt")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        console.error("Get users error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// GET /api/users/:id
// Get one ordinary user
exports.getUserById = async (req, res) => {
    try {
        await connectDB();

        const user = await User.findOne({
            _id: req.params.id,
            role: { $in: ORDINARY_ROLES },
        }).select("name email phone city role createdAt");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// POST /api/users
// Create ordinary user - superadmin only
exports.createUser = async (req, res) => {
    try {
        await connectDB();

        const { name, email, phone, city, password } = req.body;

        if (!name || !email || !phone || !city || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const cleanPhone = phone.replace(/[\s-]/g, "");
        const cleanEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            $or: [
                { email: cleanEmail },
                { phone: cleanPhone },
            ],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email or phone number already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: cleanEmail,
            phone: cleanPhone,
            city,
            password: hashedPassword,
            role: "user",
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Create user error:", err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

// PUT /api/users/:id
// Update ordinary user - superadmin only
exports.updateUser = async (req, res) => {
    try {
        await connectDB();

        const { name, email, phone, city, password } = req.body;

        const user = await User.findOne({
            _id: req.params.id,
            role: { $in: ORDINARY_ROLES },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Ordinary user not found",
            });
        }

        if (name !== undefined) user.name = name;

        if (email !== undefined) {
            user.email = email.trim().toLowerCase();
        }

        if (phone !== undefined) {
            user.phone = phone.replace(/[\s-]/g, "");
        }

        if (city !== undefined) user.city = city;

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must contain at least 6 characters",
                });
            }

            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Update user error:", err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

// DELETE /api/users/:id
// Delete ordinary user - superadmin only
exports.deleteUser = async (req, res) => {
    try {
        await connectDB();

        const user = await User.findOneAndDelete({
            _id: req.params.id,
            role: { $in: ORDINARY_ROLES },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Ordinary user not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// POST /api/users/login
// Login - all account roles
exports.loginUser = async (req, res) => {
    try {
        await connectDB();

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.password) {
            return res.status(500).json({
                success: false,
                message: "User password is missing from the database"
            });
        }

        console.log("Login debug:", {
            emailReceived: typeof email,
            passwordReceived: typeof password,
            userFound: !!user,
            storedPasswordExists: !!user?.password,
            storedPasswordType: typeof user?.password,
            storedPasswordLength: user?.password?.length
        });

        if (typeof password !== "string" || typeof user.password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid password data. Check the user record."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};