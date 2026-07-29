import express from "express";
import Registration from "../models/Registration.js";
import Hackathon from "../models/Hackathon.js";
import { protect, organizerOnly } from "../middleware/auth.js";

const router = express.Router();

// POST /api/registrations/:hackathonId
// Participant registers for a hackathon
router.post("/:hackathonId", protect, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.hackathonId);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    // Check if registration is open
    if (!hackathon.registrationOpen) {
      return res.status(400).json({ message: "Registration is closed" });
    }

    // Check if already registered
    const exists = await Registration.findOne({
      user: req.user.id,
      hackathon: req.params.hackathonId,
    });
    if (exists) return res.status(400).json({ message: "Already registered" });

    const registration = await Registration.create({
      user: req.user.id,
      hackathon: req.params.hackathonId,
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/registrations/my
// Participant views their own registrations
router.get("/my", protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate("hackathon", "title theme startDate endDate mode status");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/registrations/hackathon/:hackathonId
// Organizer views all registrations for their hackathon
router.get("/hackathon/:hackathonId", protect, organizerOnly, async (req, res) => {
  try {
    const registrations = await Registration.find({ hackathon: req.params.hackathonId })
      .populate("user", "name email college");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/registrations/:id/status
// Organizer approves or rejects a registration
router.put("/:id/status", protect, organizerOnly, async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/registrations/:hackathonId/cancel
// Participant cancels their registration
router.delete("/:hackathonId/cancel", protect, async (req, res) => {
  try {
    const registration = await Registration.findOneAndDelete({
      user: req.user.id,
      hackathon: req.params.hackathonId,
    });
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.json({ message: "Registration cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
