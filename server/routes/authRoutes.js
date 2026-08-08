// ─── routes/authRoutes.js ─────────────────────────────────────────────────────
// Handles everything related to USERS:
//   - Signup (create account)
//   - Login (get a token)
//   - View/update own profile
//   - Admin: manage all users

import express from "express";
import bcrypt from "bcryptjs";   // bcrypt – used to securely hash passwords
import jwt from "jsonwebtoken";  // jwt – used to create login tokens
import User from "../models/User.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router(); // Create a mini Express app for these routes

// ── Helper: Create a JWT Token ────────────────────────────────────────────────
// This runs when a user logs in or signs up.
// We store the user's id and role inside the token.
// The token expires in 7 days.
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // payload = data stored inside the token
    process.env.JWT_SECRET,            // secret key (from .env file)
    { expiresIn: "7d" }                // token expires after 7 days
  );
};

// ── Helper: Normalize Role ────────────────────────────────────────────────────
// Prevent someone from signing up with an invalid role like "superuser"
const normalizeRole = (role) => {
  if (role === "organizer") return "organizer";
  if (role === "judge") return "judge";
  if (role === "admin") return "admin";
  return "participant"; // Default: if unknown role, make them a participant
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/signup
// Creates a new user account
// ─────────────────────────────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    // 1. Get the data sent by the user from the request body
    const { name, email, password, role, college } = req.body;

    // 2. Validate: make sure required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // 3. Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 4. Make sure the role is valid
    const requestedRole = normalizeRole(role);

    // 5. Admin signup can be blocked by the environment variable
    if (requestedRole === "admin" && process.env.ALLOW_ADMIN_SIGNUP !== "true") {
      return res.status(403).json({ message: "Admin sign-up is disabled" });
    }

    // 6. Hash the password (NEVER store plain text passwords!)
    // bcrypt.hash(password, 10) — 10 is the "salt rounds" (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Create and save the new user in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Store hashed password, not plain text
      role: requestedRole,
      college,
    });

    // 8. Send back the token and basic user info
    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Checks email + password and returns a token
// ─────────────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Check if the admin has blocked this user
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Contact admin." });
    }

    // 3. Compare the entered password with the hashed password in the database
    // bcrypt.compare returns true if they match, false otherwise
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4. Password matched — send back a token
    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, college: user.college },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/profile
// Returns the logged-in user's profile (requires login token)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/profile", protect, async (req, res) => {
  try {
    // req.user.id was set by the protect middleware
    // .select("-password") means "return everything EXCEPT the password field"
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/auth/profile
// Update own name/college (requires login token)
// ─────────────────────────────────────────────────────────────────────────────
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, college } = req.body;
    // findByIdAndUpdate finds the user and updates it in one step
    // { new: true } returns the UPDATED document instead of the old one
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, college },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/users
// Admin only: list ALL users on the platform
// ─────────────────────────────────────────────────────────────────────────────
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    // Find all users, exclude passwords, sort newest first
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/stats
// Admin only: platform analytics numbers
// ─────────────────────────────────────────────────────────────────────────────
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    // Dynamically import other models to avoid circular dependency issues
    const Hackathon = (await import("../models/Hackathon.js")).default;
    const Team = (await import("../models/Team.js")).default;
    const Submission = (await import("../models/Submission.js")).default;

    // countDocuments() counts how many documents are in each collection
    // Promise.all runs all 4 queries at the same time (faster!)
    const [totalUsers, totalHackathons, totalTeams, totalSubmissions] = await Promise.all([
      User.countDocuments(),
      Hackathon.countDocuments(),
      Team.countDocuments(),
      Submission.countDocuments(),
    ]);

    res.json({ totalUsers, totalHackathons, totalTeams, totalSubmissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/auth/users/:id/block
// Admin only: toggle block/unblock a user
// ─────────────────────────────────────────────────────────────────────────────
router.put("/users/:id/block", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle: if blocked → unblock, if not blocked → block
    user.isBlocked = !user.isBlocked;
    await user.save(); // Save the change to the database

    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, isBlocked: user.isBlocked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/auth/users/:id
// Admin only: edit any user's details (name, role, college)
// ─────────────────────────────────────────────────────────────────────────────
router.put("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, role, college } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, college },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/auth/users/:id
// Admin only: permanently delete a user
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
