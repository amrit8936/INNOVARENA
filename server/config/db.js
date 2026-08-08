// ─── config/db.js ─────────────────────────────────────────────────────────────
// This file handles connecting to the MongoDB database.
// We use Mongoose, which is a library that makes it easier to work with MongoDB.
//
// This function is called ONCE when the server starts (in server.js).

import mongoose from "mongoose"; // Mongoose – ODM (Object Data Modeling) library for MongoDB

// connectDB is an async function because connecting to a database takes time
const connectDB = async () => {
  // Check that the MONGO_URI is set in the .env file
  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI is not set in .env file. Add it to connect to MongoDB.");
    return; // Stop here if no URI is provided
  }

  try {
    // mongoose.connect() opens the connection to MongoDB
    // MONGO_URI looks like: mongodb://localhost:27017/innovarena
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000, // Give up if can't connect in 3 seconds
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    // If connection fails, log the error but don't crash the server
    console.warn("⚠️ MongoDB Connection Failed:", error.message);
    console.warn("Server will start but database operations will fail.");
  }
};

export default connectDB;
