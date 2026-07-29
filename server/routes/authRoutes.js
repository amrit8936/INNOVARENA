import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

// Helper: Create a JWT token for a user
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper: Normalize role – prevent random roles being passed
const normalizeRole = (role) => {
  if (role === "organizer") return "organizer";
  if (role === "judge") return "judge";
  if (role === "admin") return "admin";
  return "participant";
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, college } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const requestedRole = normalizeRole(role);

    // Admin signup is disabled by default
    if (requestedRole === "admin" && process.env.ALLOW_ADMIN_SIGNUP !== "true") {
      return res.status(403).json({ message: "Admin sign-up is disabled" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: requestedRole,
      college,
    });

    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, college: user.college },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/profile  –  get logged-in user's profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/auth/profile  –  update own profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, college } = req.body;
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

// GET /api/auth/users  –  admin: list all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/stats  –  admin: platform analytics numbers
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const Hackathon = (await import("../models/Hackathon.js")).default;
    const Team = (await import("../models/Team.js")).default;
    const Submission = (await import("../models/Submission.js")).default;

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

// PUT /api/auth/users/:id/block  –  admin: block or unblock a user
router.put("/users/:id/block", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle block status
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, isBlocked: user.isBlocked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/auth/users/:id  –  admin: delete a user
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
