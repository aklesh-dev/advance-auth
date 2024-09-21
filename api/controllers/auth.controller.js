import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res, next) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        };

        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            res.status(400).json({ success: false, message: "User already exist" });
            return;
        };

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours return in milliseconds 
        });

        await user.save();

        // jwt token generation
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    };
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({ success: false, message: "Invalid or expired verification code" });
            return;
        };

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: { ...user._doc, password: undefined }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error"});
    }
};

export const signin = async (req, res, next) => {
    res.send("signin Controller");
};

export const signout = async (req, res, next) => {
    res.clearCookie("access-token").status(200).json({ success: true, message: "User signed out successfully" });
};