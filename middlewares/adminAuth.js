import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import User from "../models/user.js";

export async function adminAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Invalid token, kindly sign in as an admin",
    });
  }

  const token = authorization.slice(7);

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    const { username, isAdmin } = verified;

    // Check in both User and Admin collections by username
    const admin = await Admin.findOne({ username }) || await User.findOne({ username });

    if (!admin || !admin.isAdmin) {
      return res.status(401).json({
        error: "Admin not found or not authorized",
      });
    }

    req.admin = verified;
    next();
  } catch (error) {
    console.error("Error verifying admin token:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
}
