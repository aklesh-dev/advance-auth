import express from 'express';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './database/connectDB.js';

dotenv.config();

const app = express();
app.use(express.json());


app.listen(3000, () => {
    connectDB();
    console.log('Server is running on port 3000');
});

app.get('/api', (req, res) => {
    res.send('Welcome to Advance-Auth API');
});
