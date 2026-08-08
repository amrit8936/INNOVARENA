// ─── models/Submission.js ─────────────────────────────────────────────────────
// The Submission MODEL stores a team's project submission for a hackathon.

import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    // Which team is submitting this project
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    // Which hackathon this submission is for
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },

    // ── Project Details ──────────────────────────────────────────────────────
    projectName: { type: String, required: true },
    problemStatement: { type: String, default: "" },      // What problem does it solve?
    solutionDescription: { type: String, required: true }, // How does it solve it?
    githubLink: { type: String, required: true },          // GitHub repository URL
    liveDemo: { type: String, default: "" },               // Live deployment URL
    techStack: { type: String, default: "" },              // e.g. "React, Node.js, MongoDB"
    videoLink: { type: String, default: "" },              // Demo video URL

    // ── Review Info ──────────────────────────────────────────────────────────
    // Status of the submission
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending",
    },

    // Total score given by the judge (copied from Review for easy leaderboard access)
    score: { type: Number, default: 0 },

    // Written feedback from judge
    feedback: { type: String, default: "" },

    // Which judge reviewed this submission
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
