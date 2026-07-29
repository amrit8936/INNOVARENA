import mongoose from "mongoose";

// User schema – stores info about every user on the platform
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 4 roles: participant, organizer, judge, admin
    role: {
      type: String,
      enum: ["participant", "organizer", "judge", "admin"],
      default: "participant",
    },

    college: { type: String, default: "" },

    // Admin can block a user to prevent login
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
