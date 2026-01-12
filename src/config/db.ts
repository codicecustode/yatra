import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

//connect to mongo db database
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/secure_comm_db';

    // Connection configuration
    await mongoose.connect(mongoURI);

    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1); 
  }
};

// handle disconnected event
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});