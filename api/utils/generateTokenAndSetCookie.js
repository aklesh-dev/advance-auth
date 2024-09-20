import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });

    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", //  only send cookie over https in production
        sameSite: "strict", //  prevent cross-site request forgery attacks (CSRF)
        maxAge: 7 * 24 * 60 * 60 * 1000, //  After 7 days, the cookie will expire,
    });

    return token;
};