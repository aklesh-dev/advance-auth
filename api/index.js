import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './database/connectDB.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); // To parse JSON data in request body // allows us to parse incoming requests: req.body
app.use(cookieParser()); // allows us to parse cookies in request headers

// Routes
app.use('/api/auth', authRoutes);


// Connect to database
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port: ${PORT}`);
});
