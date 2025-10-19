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
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
    },
    { timestamps: true }
);

// Prevent model overwrite in dev / serverless environments
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
