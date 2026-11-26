const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [
                /^\+?\d{7,15}$/,
                "Please enter a valid phone number",
            ],
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "player", "admin", "superadmin"],
            default: "user",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.User || mongoose.model("User", userSchema);