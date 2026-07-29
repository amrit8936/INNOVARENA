import mongoose from "mongoose";

// Review schema – judge scores a submission
const reviewSchema = new mongoose.Schema(
  {
    // Which submission is being reviewed
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    },

    // Which judge reviewed it
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Which hackathon this review belongs to
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },

    // Scores for each judging criterion (out of 10 each)
    innovation: { type: Number, default: 0, min: 0, max: 10 },
    technical: { type: Number, default: 0, min: 0, max: 10 },
    design: { type: Number, default: 0, min: 0, max: 10 },
    functionality: { type: Number, default: 0, min: 0, max: 10 },
    presentation: { type: Number, default: 0, min: 0, max: 10 },

    // Total score (sum of all criteria)
    totalScore: { type: Number, default: 0 },

    // Written feedback from judge
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
