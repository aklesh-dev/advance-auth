import mongoose from "mongoose";


export default async function connectDB() {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected: ", connect.connection.host);
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error.message);
        process.exit(1); // Exit the process if the connection fails || 1 is the code for uncaught exception and 0 is for successful execution.
    };
};