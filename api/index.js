import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import connectDB from './database/connectDB.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); // To get the current directory path

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // To allow cross-origin requests


app.use(express.json()); // To parse JSON data in request body // allows us to parse incoming requests: req.body
app.use(cookieParser()); // allows us to parse cookies in request headers

// Routes
app.use('/api/auth', authRoutes);

// ------------------ Serve React App ------------------
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'client/dist')));

    app.get("*",(req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    });
};


// Connect to database
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port: ${PORT}`);
});
