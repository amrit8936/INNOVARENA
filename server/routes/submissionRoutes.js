import express from "express";
import Submission from "../models/Submission.js";
import { protect, judgeOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/submissions  –  all submissions (admin & judge)
router.get("/", protect, async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("team", "teamName")
      .populate("hackathon", "title")
      .populate("reviewer", "name");
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/submissions/my  –  participant's team's submissions
router.get("/my", protect, async (req, res) => {
  try {
    // Find teams the user belongs to, then find submissions for those teams
    const Team = (await import("../models/Team.js")).default;
    const myTeams = await Team.find({
      $or: [{ leader: req.user.id }, { members: req.user.id }],
    });
    const teamIds = myTeams.map((t) => t._id);

    const submissions = await Submission.find({ team: { $in: teamIds } })
      .populate("team", "teamName")
      .populate("hackathon", "title startDate endDate");
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/submissions/hackathon/:hackathonId  –  all submissions for one hackathon
router.get("/hackathon/:hackathonId", async (req, res) => {
  try {
    const submissions = await Submission.find({ hackathon: req.params.hackathonId })
      .populate("team", "teamName")
      .sort({ score: -1 }); // highest score first (leaderboard order)
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/submissions/:id  –  single submission details
router.get("/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("team", "teamName members")
      .populate("hackathon", "title")
      .populate("reviewer", "name");
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/submissions  –  participant team submits a project
router.post("/", protect, async (req, res) => {
  try {
    const { teamId, hackathonId, projectName, problemStatement, solutionDescription, githubLink, liveDemo, techStack, videoLink } = req.body;

    // Check for duplicate submission by same team in same hackathon
    const existing = await Submission.findOne({ team: teamId, hackathon: hackathonId });
    if (existing) {
      return res.status(400).json({ message: "Your team already submitted a project for this hackathon" });
    }

    const submission = await Submission.create({
      team: teamId,
      hackathon: hackathonId,
      projectName,
      problemStatement,
      solutionDescription,
      githubLink,
      liveDemo,
      techStack,
      videoLink,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/submissions/:id  –  edit submission (participant, before deadline)
router.put("/:id", protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate("team");

    if (!submission) return res.status(404).json({ message: "Submission not found" });

    // Only allow edit if still pending
    if (submission.status !== "pending") {
      return res.status(400).json({ message: "Cannot edit a submission that is already under review" });
    }

    const updated = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/submissions/:id/review  –  judge reviews a submission (basic review)
router.put("/:id/review", protect, judgeOnly, async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      {
        score,
        feedback,
        status: "approved",
        reviewer: req.user.id,
      },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
