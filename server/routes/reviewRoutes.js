import express from "express";
import Review from "../models/Review.js";
import Submission from "../models/Submission.js";
import { protect, judgeOnly } from "../middleware/auth.js";

const router = express.Router();

// POST /api/reviews
// Judge submits a review for a submission
router.post("/", protect, judgeOnly, async (req, res) => {
  try {
    const { submissionId, hackathonId, innovation, technical, design, functionality, presentation, feedback } = req.body;

    // Calculate total score (sum of all 5 criteria)
    const totalScore = innovation + technical + design + functionality + presentation;

    // Create the review
    const review = await Review.create({
      submission: submissionId,
      judge: req.user.id,
      hackathon: hackathonId,
      innovation,
      technical,
      design,
      functionality,
      presentation,
      totalScore,
      feedback,
    });

    // Also update the submission's score and status
    await Submission.findByIdAndUpdate(submissionId, {
      score: totalScore,
      feedback,
      status: "approved",
      reviewer: req.user.id,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reviews/hackathon/:hackathonId
// Get all reviews for a hackathon (used for leaderboard)
router.get("/hackathon/:hackathonId", async (req, res) => {
  try {
    const reviews = await Review.find({ hackathon: req.params.hackathonId })
      .populate({
        path: "submission",
        populate: { path: "team", select: "teamName" },
      })
      .populate("judge", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reviews/my
// Judge sees their own reviews
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
