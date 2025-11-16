import jwt from "jsonwebtoken";
import config from "../../config/config.js";

/**
 * Basic JWT guard that expects the token in Authorization: Bearer <token>.
 * When valid, the decoded payload is placed on req.user so downstream handlers
 * know who is making the request.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization; // Read the Authorization header sent by the client.

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If there is no header or it doesn't follow the Bearer scheme, reject immediately.
    return res.status(401).json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token string after "Bearer".

  try {
    const decoded = jwt.verify(token, config.jwtSecret); // Validate the token signature and expiry with our secret.
    req.user = {
      _id: decoded._id, // Attach whatever details we encoded (here the Mongo user id).
      role: decoded.role || "user", // Role can be used later for RBAC; default to "user" when absent.
    };
    return next(); // Token looks good, hand control to the next middleware/route handler.
  } catch (err) {

    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Ensures the authenticated user has the admin role before allowing mutations.
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin privileges required" });
  }
  return next();
};
