// ─── models/Hackathon.js ──────────────────────────────────────────────────────
// The Hackathon MODEL defines what one hackathon event looks like in MongoDB.

import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    // Basic info about the hackathon
    title: { type: String, required: true },         // Name of the hackathon
    description: { type: String, required: true },   // Full description
    theme: { type: String, default: "General" },     // Theme e.g. "AI", "Web3", "Healthcare"

    // Is this an online or offline event?
    mode: { type: String, enum: ["Online", "Offline"], default: "Online" },
    venue: { type: String, default: "" },             // Location if it's offline

    // Important dates
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date },             // Last date to register

    // Prize and team settings
    prizePool: { type: String, default: "0" },        // e.g. "₹50,000"
    maxTeamSize: { type: Number, default: 4 },        // Max members per team

    // Extra details written by the organizer
    rules: { type: String, default: "" },
    judgingCriteria: { type: String, default: "" },
    bannerImage: { type: String, default: "" },       // URL to banner image

    // Controls whether participants can register
    registrationOpen: { type: Boolean, default: true },

    // Current state of the hackathon
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    // Who created this hackathon (reference to a User document)
    // ObjectId is MongoDB's way of storing a reference/link to another document
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // This links to the User model
      required: true,
    },

    // Array of judges assigned to this hackathon (each is a reference to a User)
    judges: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Winners list published after the hackathon ends
    // Each winner has: rank, team name, project name
    winners: [
      {
        rank: { type: Number },
        teamName: { type: String },
        projectName: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Hackathon", hackathonSchema);
