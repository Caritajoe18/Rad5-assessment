import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import User from "../models/user.js";

export async function adminAuth(req, res, next) {
  if (process.env.NODE_ENV === "test") {
    //console.log("Test environment detected, bypassing authentication.");
    req.user = { _id: "mockUserId" };
    return next();
  }

  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Invalid token, kindly sign in as an admin",
    });
  }

  const token = authorization.slice(7);

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const username = verified.username;

    
    const user = await User.findOne({ username });
    if (user) {
      console.log(`User found: ${user.username}`);
      if (user.isAdmin) {

        req.admin = verified;
        return next();
      } else {
        return res.status(401).json({
          error: "User not an admin",
        });
      }
    }

    // If no user found, check in Admin collection
    const admin = await Admin.findOne({ username });
    console.log(`Admin found: ${admin ? admin.username : 'None'}`);

    if (!admin) {
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
