import mongoose from "mongoose";

// Hackathon schema – stores all info about one hackathon event
const hackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    theme: { type: String, default: "General" },

    // Online or Offline event
    mode: { type: String, enum: ["Online", "Offline"], default: "Online" },
    venue: { type: String, default: "" }, // location if offline

    // Dates
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date },

    // Prize and team settings
    prizePool: { type: String, default: "0" },
    maxTeamSize: { type: Number, default: 4 },

    // Extra details
    rules: { type: String, default: "" },
    judgingCriteria: { type: String, default: "" },
    bannerImage: { type: String, default: "" },

    // Is registration currently open?
    registrationOpen: { type: Boolean, default: true },

    // Status of the hackathon
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    // Who created this hackathon (organizer)
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hackathon", hackathonSchema);
