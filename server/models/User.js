// ─── models/User.js ───────────────────────────────────────────────────────────
// The User MODEL defines what a "user" document looks like in MongoDB.
// Think of it as a blueprint/template for every user stored in the database.

import mongoose from "mongoose"; // Mongoose helps us define schemas and talk to MongoDB

// Schema = the structure / shape of a document in MongoDB
const userSchema = new mongoose.Schema(
  {
    // User's display name — required field
    name: { type: String, required: true },

    // Email must be unique so two people can't use the same email
    email: { type: String, required: true, unique: true },

    // Password will be stored as a hash (never in plain text!) using bcrypt
    password: { type: String, required: true },

    // Role controls what the user can do on the platform
    // enum = only these specific values are allowed
    role: {
      type: String,
      enum: ["participant", "organizer", "judge", "admin"],
      default: "participant", // If no role given, default to participant
    },

    // College / institution the user belongs to
    college: { type: String, default: "" },

    // Admin can block a user to prevent them from logging in
    isBlocked: { type: Boolean, default: false },
  },
  // timestamps: true automatically adds createdAt and updatedAt fields
  { timestamps: true }
);

// Create and export the model
// mongoose.model("User", userSchema) creates a "users" collection in MongoDB
export default mongoose.model("User", userSchema);
