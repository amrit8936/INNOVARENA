// ─── routes/registrationRoutes.js ────────────────────────────────────────────
// Handles hackathon REGISTRATIONS:
//   - Participant registers for a hackathon
//   - Participant cancels their registration
//   - Participant views their own registrations
//   - Organizer views all registrations for their hackathon
//   - Organizer approves or rejects a registration

import express from "express";
import Registration from "../models/Registration.js";
import Hackathon from "../models/Hackathon.js";
import { protect, organizerOnly } from "../middleware/auth.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/registrations/:hackathonId
// Participant registers for a hackathon
// ─────────────────────────────────────────────────────────────────────────────
router.post("/:hackathonId", protect, async (req, res) => {
  try {
    // 1. Check if this hackathon exists
    const hackathon = await Hackathon.findById(req.params.hackathonId);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    // 2. Check if registration is open
    if (!hackathon.registrationOpen) {
      return res.status(400).json({ message: "Registration is closed for this hackathon" });
    }

    // 3. Check if this user already registered for this hackathon
    const exists = await Registration.findOne({
      user: req.user.id,
      hackathon: req.params.hackathonId,
    });
    if (exists) return res.status(400).json({ message: "You are already registered" });

    // 4. Create the registration document (status defaults to "pending")
    const registration = await Registration.create({
      user: req.user.id,
      hackathon: req.params.hackathonId,
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/registrations/my
// Participant views all hackathons they registered for
// ─────────────────────────────────────────────────────────────────────────────
router.get("/my", protect, async (req, res) => {
  try {
    // Find registrations where the user matches the logged-in user
    // .populate("hackathon", "title theme ...") fills in hackathon details instead of just the ID
    const registrations = await Registration.find({ user: req.user.id })
      .populate("hackathon", "title theme startDate endDate mode status registrationOpen");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/registrations/hackathon/:hackathonId
// Organizer views all registrations for a specific hackathon
// ─────────────────────────────────────────────────────────────────────────────
router.get("/hackathon/:hackathonId", protect, organizerOnly, async (req, res) => {
  try {
    const registrations = await Registration.find({ hackathon: req.params.hackathonId })
      .populate("user", "name email college"); // Fill in user details
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/registrations/:id/status
// Organizer approves or rejects a registration
// Body: { status: "approved" } or { status: "rejected" }
// ─────────────────────────────────────────────────────────────────────────────
router.put("/:id/status", protect, organizerOnly, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate: only allow approved or rejected
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated document
    );
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/registrations/:hackathonId/cancel
// Participant cancels their own registration for a hackathon
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/:hackathonId/cancel", protect, async (req, res) => {
  try {
    // findOneAndDelete finds the matching document and deletes it in one step
    const registration = await Registration.findOneAndDelete({
      user: req.user.id,                      // Must be the logged-in user
      hackathon: req.params.hackathonId,      // For this hackathon
    });
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
