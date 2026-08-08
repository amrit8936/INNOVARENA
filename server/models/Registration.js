// ─── models/Registration.js ───────────────────────────────────────────────────
// The Registration MODEL tracks which participant signed up for which hackathon.
// One registration = one participant + one hackathon.

import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    // The participant who registered (reference to User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The hackathon they registered for (reference to Hackathon)
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },

    // The organizer can approve or reject each registration
    // Default is "pending" — waits for organizer action
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export default mongoose.model("Registration", registrationSchema);
