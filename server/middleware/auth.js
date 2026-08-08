// ─── middleware/auth.js ────────────────────────────────────────────────────────
// Authentication & Authorization Middleware
//
// Middleware = a function that runs BETWEEN the request arriving and the
// route handler running. We use it to:
//   1. Check that the user is logged in (protect)
//   2. Check that the user has the right role (adminOnly, organizerOnly, etc.)

import jwt from "jsonwebtoken"; // jsonwebtoken – used to verify our login tokens

// ── protect ────────────────────────────────────────────────────────────────────
// This function checks if the user sent a valid JWT token.
// Add it to any route that requires the user to be logged in.
export const protect = (req, res, next) => {
  // The token is sent in the request header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  // If there is no token at all, reject the request
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Extract just the token part (remove the "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // Verify the token using our secret key
    // If valid, jwt.verify returns the payload we stored when we created the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to req.user so route handlers can access it
    // decoded contains { id, role } – the values we stored when the user logged in
    req.user = decoded;

    // Call next() to move on to the actual route handler
    next();
  } catch (error) {
    // If the token is expired or tampered with, reject the request
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ── authorizeRoles ─────────────────────────────────────────────────────────────
// A helper that creates a middleware for role checking.
// Usage: authorizeRoles("admin", "organizer") — only those roles can proceed.
export const authorizeRoles = (...roles) => (req, res, next) => {
  // req.user is set by the protect middleware above
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied – you don't have permission" });
  }
  next(); // Role matches, continue
};

// ── organizerOnly ──────────────────────────────────────────────────────────────
// Only organizers (and admins) can access these routes
export const organizerOnly = (req, res, next) => {
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Organizer access only" });
  }
  next();
};

// ── judgeOnly ─────────────────────────────────────────────────────────────────
// Only judges (and admins) can access these routes
export const judgeOnly = authorizeRoles("judge", "admin");

// ── adminOnly ─────────────────────────────────────────────────────────────────
// Only admins can access these routes
export const adminOnly = authorizeRoles("admin");
