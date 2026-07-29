import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI is not set. Starting without a database connection.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.warn("⚠️ MongoDB Connection Failed:", error.message);
    console.warn("The server will continue running without a database connection.");
  }
};

export default connectDB;
