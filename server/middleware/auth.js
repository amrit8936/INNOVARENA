import jwt from "jsonwebtoken";

// Checks the token and attaches the logged-in user's id + role to req.user
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// Only allow organizers or admins to access certain routes
export const organizerOnly = (req, res, next) => {
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Organizer access only" });
  }
  next();
};

export const judgeOnly = authorizeRoles("judge", "admin");
export const adminOnly = authorizeRoles("admin");
