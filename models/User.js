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
        mobile: {
            type: String,
            required: [true, "Mobile number is required"],
            unique: true,
            match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],

        },
        city: {
            type: String,
            required: [true, "City is required"],
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
