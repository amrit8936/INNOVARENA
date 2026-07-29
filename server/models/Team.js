import mongoose from "mongoose";

// Team schema – a group of participants for a hackathon
const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },

    // Leader is the person who created the team
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Array of user references (includes leader)
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Which hackathon this team is for
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },

    // Organizer can approve or reject a team
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
