import express from "express";
import Hackathon from "../models/Hackathon.js";
import { protect, organizerOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/hackathons  -> list all
router.get("/", async (req, res) => {
  try {
    const hackathons = await Hackathon.find().populate("organizer", "name email");
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/hackathons/:id  -> single hackathon
router.get("/:id", async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).populate("organizer", "name email");
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/hackathons  -> organizer creates a hackathon
router.post("/", protect, organizerOnly, async (req, res) => {
  try {
    const { title, description, theme, mode, prizePool, startDate, endDate } = req.body;

    const hackathon = await Hackathon.create({
      title,
      description,
      theme,
      mode,
      prizePool,
      startDate,
      endDate,
      organizer: req.user.id,
    });

    res.status(201).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/hackathons/:id -> organizer edits their hackathon
router.put("/:id", protect, organizerOnly, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user.id },
      req.body,
      { new: true }
    );
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/hackathons/:id -> organizer deletes their hackathon
router.delete("/:id", protect, organizerOnly, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOneAndDelete({
      _id: req.params.id,
      organizer: req.user.id,
    });
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
    res.json({ message: "Hackathon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
