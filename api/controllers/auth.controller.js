import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";

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

export const signin = async (req, res, next) => {
    res.send("signin Controller");
};

export const signout = async (req, res, next) => {
    res.send("logout Controller");
};