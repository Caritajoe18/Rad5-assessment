import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validators/userValid.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


export async function register(req, res) {
  try {
    const { username, password } = req.body;

    const validateUser = registerUserSchema.validate(req.body);
    if (validateUser.error) {
      return res
        .status(400)
        .json({ Error: validateUser.error.details[0].message });
    }

    const passwordHash = await bcrypt.hash(password, bcrypt.genSaltSync());

    const exists = await User.findOne({ username });

    if (!exists) {
      const newUser = await User.create({
        username,
        password: passwordHash,
      });

      return res.status(201).json({
        msg: "user created successfully",
        newUser,
      });
    }

    return res.status(400).json({
      error: "User already exists",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const validateUser = loginUserSchema.validate(req.body);
    if (validateUser.error) {
      return res
        .status(400)
        .json({ error: validateUser.error.details[0].message });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const { _id } = user;
    //console.log("JWT_SECRETlll:", jwtsecret);
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      return res.status(200).json({
        msg: "user login successful",
        user,
        token,
      });
    }

    return res.status(400).json({
      error: "Invalid password",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
}

export async function webHooks(req, res) {
  try {
    const { eventType, data } = req.body;

    if (!eventType || !data) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    const logMessage = `Received event: ${eventType}\nData: ${JSON.stringify(
      data,
      null,
      2
    )}\n`;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const logFilePath = path.join(__dirname, "../logs/webhook.log");

    const logsDir = path.dirname(logFilePath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(logFilePath, logMessage);

    console.log(`Event received: ${eventType}`);
    res.status(200).json({ message: "Event received successfully" });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
