import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - Access token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) return res.status(401).json({ success: false, message: 'Invalid access token' });

        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.error("Error while verifying token: ", error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};