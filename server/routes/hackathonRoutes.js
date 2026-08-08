import express from "express";
import Hackathon from "../models/Hackathon.js";
import User from "../models/User.js";
import { protect, organizerOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/hackathons  -> list all (public)
router.get("/", async (req, res) => {
  try {
    const hackathons = await Hackathon.find()
      .populate("organizer", "name email")
      .populate("judges", "name email");
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/hackathons/:id  -> single hackathon (public)
router.get("/:id", async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("judges", "name email");
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/hackathons  -> organizer creates a hackathon
router.post("/", protect, organizerOnly, async (req, res) => {
  try {
    const {
      title, description, theme, mode, prizePool,
      startDate, endDate, venue, maxTeamSize,
      rules, judgingCriteria, registrationDeadline,
    } = req.body;

    // Validate required fields
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "Title, description, start date and end date are required" });
    }

    const hackathon = await Hackathon.create({
      title, description, theme, mode, prizePool,
      startDate, endDate, venue, maxTeamSize,
      rules, judgingCriteria, registrationDeadline,
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
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found or not authorized" });
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
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found or not authorized" });
    res.json({ message: "Hackathon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/hackathons/:id/toggle-registration
// Organizer opens or closes registration for their hackathon
router.put("/:id/toggle-registration", protect, organizerOnly, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    hackathon.registrationOpen = !hackathon.registrationOpen;
    await hackathon.save();
    res.json({
      message: `Registration ${hackathon.registrationOpen ? "opened" : "closed"}`,
      registrationOpen: hackathon.registrationOpen,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/hackathons/:id/assign-judge
// Organizer assigns a judge by email to their hackathon
router.put("/:id/assign-judge", protect, organizerOnly, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Judge email is required" });

    // Find the judge user by email
    const judge = await User.findOne({ email, role: "judge" });
    if (!judge) return res.status(404).json({ message: "No judge found with that email" });

    const hackathon = await Hackathon.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    // Check if already assigned
    const alreadyAssigned = hackathon.judges.some((j) => j.toString() === judge._id.toString());
    if (alreadyAssigned) return res.status(400).json({ message: "Judge already assigned to this hackathon" });

    hackathon.judges.push(judge._id);
    await hackathon.save();

    res.json({
      message: `${judge.name} assigned as judge`,
      judge: { id: judge._id, name: judge.name, email: judge.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/hackathons/:id/remove-judge/:judgeId
// Organizer removes a judge from their hackathon
router.delete("/:id/remove-judge/:judgeId", protect, organizerOnly, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    hackathon.judges = hackathon.judges.filter((j) => j.toString() !== req.params.judgeId);
    await hackathon.save();
    res.json({ message: "Judge removed from hackathon" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/hackathons/:id/publish-winners
// Organizer publishes winners and marks hackathon as completed
router.put("/:id/publish-winners", protect, organizerOnly, async (req, res) => {
  try {
    const { winners } = req.body; // array of { rank, teamName, projectName }
    if (!winners || !Array.isArray(winners)) {
      return res.status(400).json({ message: "winners must be an array" });
    }

    const hackathon = await Hackathon.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user.id },
      { winners, status: "completed" },
      { new: true }
    );
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    res.json({ message: "Winners published! Hackathon marked as completed.", hackathon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
