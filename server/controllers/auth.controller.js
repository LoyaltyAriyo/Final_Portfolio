import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "./../../config/config.js";

// Helper: central place to create signed JWTs so the logic is easy to reuse.
const generateToken = (user) => {
  // Include role so downstream middleware can enforce RBAC.
  const payload = { _id: user._id, role: user.role || "user" };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" }); // Sign token with secret and optional expiry.
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract credentials sent by the client.
    const user = await User.findOne({ email }); // Look up the user document by email.

    if (!user) {
      return res.status(401).json({ error: "User not found" }); // Early return if no matching user.
    }

    const passwordMatches = user.authenticate(password); // Compare hashed passwords (crypto HMAC defined in the model).
    if (!passwordMatches) {
      return res.status(401).json({ error: "Email and password don't match." }); // Fail when the hash comparison fails.
    }

    const token = generateToken(user); // Generate a signed JWT containing the user id.
    res.cookie("t", token, { expire: new Date() + 9999 }); // Optionally persist the token in a cookie for browser clients.

    return res.json({
      token, // Send the JWT so the frontend can attach it to future requests.
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user", // Include role information or fallback to a basic role.
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "Could not sign in" }); // Generic error to avoid leaking internal details.
  }
};
const signout = (req, res) => {
  // Remove the auth cookie so browsers stop sending the token automatically.
  res.clearCookie("t", {
    path: "/",
    httpOnly: true,
    sameSite: "Lax", // use 'None' + HTTPS when you need cross-origin cookies
    secure: process.env.NODE_ENV === "production", // send cookie only over HTTPS in production
  });

  /* For stateless JWTs there is no server-side session to destroy, so the frontend
     should also delete the stored token (localStorage, memory, etc.). A blacklist
     could be added later if you need to invalidate tokens centrally. */
  return res.status(200).json({ message: "User signed out" });
};
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

export default { signin, signout, requireSignin, hasAuthorization };
