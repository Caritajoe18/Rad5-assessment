import jwt from "jsonwebtoken";
import User from "../models/user.js";

export async function userAuth(req, res, next) {
  try {
    if (process.env.NODE_ENV == "test") {
      console.log("Test environment detected, bypassing authentication.");
      req.user = { _id: "mockUserId" };
      return next();
    }

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      console.warn("No authorization header or invalid format.");
      return res.status(401).json({
        error: "Invalid token, kindly sign in as a user",
      });
    }

    const token = authorization.slice(7);
    let verified;

    try {
      verified = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Error verifying token:", err);
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    if (!verified) {
      console.warn("Token verification failed.");
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    const { _id } = verified;
    const user = await User.findById(_id);

    if (!user) {
      console.warn(`User not found for ID: ${_id}`);
      return res.status(401).json({
        error: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
}
