import jwt from "jsonwebtoken";
import User from "../models/user"; 

const jwtsecret = process.env.JWT_SECRET;

if (!jwtsecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export async function userAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Invalid token, kindly sign in as a user",
    });
  }

  const token = authorization.slice(7);

  try {
    const verified = jwt.verify(token, jwtsecret);

    if (!verified) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    const { _id } = verified;
    
    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    req.user = verified;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
}
