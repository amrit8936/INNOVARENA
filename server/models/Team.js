// ─── models/Team.js ───────────────────────────────────────────────────────────
// The Team MODEL represents a group of participants for a specific hackathon.

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    // Name the team chooses for themselves
    teamName: { type: String, required: true },

    // The user who created the team is the leader
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // Links to the User model
      required: true,
    },

    // All members of the team (an array of User references)
    // Note: the leader is ALSO included in this array
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Which hackathon this team is participating in
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon", // Links to the Hackathon model
      required: true,
    },

    // Status set by the organizer
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
