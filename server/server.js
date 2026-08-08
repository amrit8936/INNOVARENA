// ─── server.js ────────────────────────────────────────────────────────────────
// This is the MAIN entry point of the backend.
// It creates the Express app, connects to MongoDB, and registers all routes.

import express from "express";   // Express – helps us create a web server easily
import cors from "cors";          // CORS – allows the frontend (React) to talk to the backend
import dotenv from "dotenv";      // dotenv – reads our secret settings from the .env file
import connectDB from "./config/db.js"; // Our custom function to connect to MongoDB

// Import all route files – each file handles one "topic" (users, hackathons, etc.)
import authRoutes from "./routes/authRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Load environment variables from the .env file into process.env
dotenv.config();

// Connect to the MongoDB database
connectDB();

// Create the Express application
const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────────
// Middleware runs on EVERY request before it reaches the route handler

app.use(cors());            // Allow requests from any origin (our React frontend)
app.use(express.json());    // Allow the server to read JSON data sent in request body

// ── Routes ─────────────────────────────────────────────────────────────────────
// Each route group handles a different part of the application

app.use("/api/auth", authRoutes);                 // Login, signup, user management
app.use("/api/hackathons", hackathonRoutes);       // Create, view, edit hackathons
app.use("/api/teams", teamRoutes);                 // Create, join, manage teams
app.use("/api/submissions", submissionRoutes);     // Submit and view projects
app.use("/api/registrations", registrationRoutes); // Register for hackathons
app.use("/api/reviews", reviewRoutes);             // Judge scoring and feedback

// A simple root route just to confirm the server is running
app.get("/", (req, res) => {
  res.send("INNOVARENA API is running 🚀");
});

// ── Start the Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
