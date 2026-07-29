import mongoose from "mongoose";

// Registration schema – tracks which participant registered for which hackathon
const registrationSchema = new mongoose.Schema(
  {
    // Who registered
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Which hackathon they registered for
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },

    // Organizer can approve or reject the registration
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);
