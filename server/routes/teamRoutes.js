import express from "express";
import Team from "../models/Team.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/teams/my  –  get all teams the logged-in user belongs to
router.get("/my", protect, async (req, res) => {
  try {
    // Find teams where user is leader OR a member
    const teams = await Team.find({
      $or: [{ leader: req.user.id }, { members: req.user.id }],
    })
      .populate("hackathon", "title startDate endDate")
      .populate("leader", "name email")
      .populate("members", "name email");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/teams  –  get all teams (admin/organizer can see all)
router.get("/", protect, async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("hackathon", "title")
      .populate("leader", "name email")
      .populate("members", "name email");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/teams/:id  –  single team details
router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("hackathon", "title startDate endDate maxTeamSize")
      .populate("leader", "name email")
      .populate("members", "name email");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/teams  –  participant creates a new team
router.post("/", protect, async (req, res) => {
  try {
    const { teamName, hackathonId } = req.body;

    // Check if user already has a team in this hackathon
    const existing = await Team.findOne({
      hackathon: hackathonId,
      $or: [{ leader: req.user.id }, { members: req.user.id }],
    });
    if (existing) {
      return res.status(400).json({ message: "You already have a team in this hackathon" });
    }

    const team = await Team.create({
      teamName,
      hackathon: hackathonId,
      leader: req.user.id,
      members: [req.user.id], // leader is also a member
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/teams/:id/join  –  participant joins an existing team
router.put("/:id/join", protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("hackathon");
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Check max team size
    if (team.members.length >= team.hackathon.maxTeamSize) {
      return res.status(400).json({ message: "Team is already full" });
    }

    // Check if user is already a member
    const alreadyMember = team.members.some((m) => m.toString() === req.user.id);
    if (alreadyMember) return res.status(400).json({ message: "Already a member" });

    team.members.push(req.user.id);
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/teams/:id/leave  –  participant leaves a team
router.put("/:id/leave", protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Leader cannot leave – they must delete the team
    if (team.leader.toString() === req.user.id) {
      return res.status(400).json({ message: "Leader cannot leave. Delete the team instead." });
    }

    // Remove user from members array
    team.members = team.members.filter((m) => m.toString() !== req.user.id);
    await team.save();
    res.json({ message: "Left team successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/teams/:id  –  only the leader can delete the team
router.delete("/:id", protect, async (req, res) => {
  try {
    const team = await Team.findOneAndDelete({
      _id: req.params.id,
      leader: req.user.id, // only leader can delete
    });
    if (!team) return res.status(404).json({ message: "Team not found or not authorized" });
    res.json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/teams/:id/transfer-leader  –  leader transfers leadership to a member
router.put("/:id/transfer-leader", protect, async (req, res) => {
  try {
    const { newLeaderId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Only the current leader can transfer
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the team leader can transfer leadership" });
    }

    // New leader must already be a member
    const isMember = team.members.some((m) => m.toString() === newLeaderId);
    if (!isMember) {
      return res.status(400).json({ message: "New leader must already be a team member" });
    }

    team.leader = newLeaderId;
    await team.save();
    res.json({ message: "Leadership transferred successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
