import mongoose from "mongoose";

// Submission schema – a team's project submission for a hackathon
const submissionSchema = new mongoose.Schema(
  {
    // Which team is submitting
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    // Which hackathon this is for
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },

    // Project details
    projectName: { type: String, required: true },
    problemStatement: { type: String, default: "" },
    solutionDescription: { type: String, required: true },
    githubLink: { type: String, required: true },
    liveDemo: { type: String, default: "" },
    techStack: { type: String, default: "" }, // e.g. "React, Node.js, MongoDB"
    videoLink: { type: String, default: "" },

    // Review status
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending",
    },

    // Score from judge (copied from Review for easy leaderboard access)
    score: { type: Number, default: 0 },

    // Basic feedback from judge
    feedback: { type: String, default: "" },

    // Which judge reviewed it
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
