import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Import all route files
import authRoutes from "./routes/authRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/reviews", reviewRoutes);

// Base route – just to test if server is running
app.get("/", (req, res) => {
  res.send("INNOVARENA API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
