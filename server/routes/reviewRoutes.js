// ─── routes/reviewRoutes.js ───────────────────────────────────────────────────
// Handles REVIEWS — when a judge scores a submission.
// Each review has 5 criteria (each out of 10), so max total = 50.

import express from "express";
import Review from "../models/Review.js";
import Submission from "../models/Submission.js";
import { protect, judgeOnly } from "../middleware/auth.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/reviews
// Judge submits scores and feedback for a submission
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", protect, judgeOnly, async (req, res) => {
  try {
    const {
      submissionId,   // Which submission is being reviewed
      hackathonId,    // Which hackathon it belongs to
      innovation,     // Score out of 10
      technical,      // Score out of 10
      design,         // Score out of 10
      functionality,  // Score out of 10
      presentation,   // Score out of 10
      feedback,       // Written comments
    } = req.body;

    // Calculate the total score by adding all 5 criteria
    const totalScore = innovation + technical + design + functionality + presentation;

    // Create the review document in MongoDB
    const review = await Review.create({
      submission: submissionId,
      judge: req.user.id, // req.user is set by the protect middleware
      hackathon: hackathonId,
      innovation,
      technical,
      design,
      functionality,
      presentation,
      totalScore,
      feedback,
    });

    // Also update the submission itself with the score and status
    // This makes it easy to show scores on the leaderboard without joining Review
    await Submission.findByIdAndUpdate(submissionId, {
      score: totalScore,
      feedback,
      status: "approved", // Mark submission as reviewed
      reviewer: req.user.id,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/reviews/hackathon/:hackathonId
// Get all reviews for a hackathon (used to build the leaderboard)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/hackathon/:hackathonId", async (req, res) => {
  try {
    const reviews = await Review.find({ hackathon: req.params.hackathonId })
      .populate({
        path: "submission",
        populate: { path: "team", select: "teamName" }, // Nested populate: submission → team
      })
      .populate("judge", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/reviews/my
// Judge sees all reviews they have submitted
// ─────────────────────────────────────────────────────────────────────────────
router.get("/my", protect, judgeOnly, async (req, res) => {
  try {
    const reviews = await Review.find({ judge: req.user.id })
      .populate("submission", "projectName status")
      .populate("hackathon", "title");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
