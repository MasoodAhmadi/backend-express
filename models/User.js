// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            trim: true,
            // Accepts numbers with optional + and 7–15 digits (international format)
            match: [
                /^\+?\d{7,15}$/,
                "Please enter a valid phone number (7–15 digits, optional +)",
            ],
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,

        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["player", "admin"],
            default: "player",
            required: true,
        },
    },
    { timestamps: true }
);

// Prevent model overwrite in dev / serverless environments
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
