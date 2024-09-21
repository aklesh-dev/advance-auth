import bcryptjs from "bcryptjs";
import crypto from 'crypto';

import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendResetPasswordEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error("All fields are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        };
        const isMatch = bcryptjs.compareSync(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        };
        if (!user.isVerified) {
            res.status(401).json({ success: false, message: "Email not verified" });
            return;
        };
        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = Date.now();

        await user.save();

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        console.log("Error in signin", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const signout = async (req, res) => {
    res.clearCookie("access_token").status(200).json({ success: true, message: "User signed out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
            return;
        };

        // Generate reset token and send it to user's email        
        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours       

        await user.save();

        // Send reset password link to user's email
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Reset password link sent to your email" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // update the password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.error('Error in password reset', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.error("Error in checkAuth", error);
        res.status(400).json({ success: false, message: error.message });
    }
};