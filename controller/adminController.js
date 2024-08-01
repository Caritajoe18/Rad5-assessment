import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/admin.js";
import User from "../models/user.js";
import Todo from "../models/todo.js";
import { loginUserSchema } from "../validators/userValid.js";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const validateUser = loginUserSchema.validate(req.body);
    if (validateUser.error) {
      return res
        .status(400)
        .json({ error: validateUser.error.details[0].message });
    }

    console.log(`Logging in admin with username: ${username}`);

    const user = await User.findOne({ username });
    const admin = await Admin.findOne({ username });

    //console.log(`User found: ${user}`);
    //console.log(`Admin found: ${admin}`);


    let isAdminUser = false;
    let adminUser = null;

    if (user && user.isAdmin) {
      isAdminUser = true;
      adminUser = user;
    } else if (admin) {
      isAdminUser = true;
      adminUser = admin;
    }

    if (!isAdminUser) {
      return res.status(403).json({ error: "User is not an admin" });
    }

    const validPassword = await bcrypt.compare(password, adminUser.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        _id: adminUser._id,
        username: adminUser.username,
        isAdmin: adminUser.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    res.status(200).json({
      msg: "Admin login successful",
      user: adminUser,
      token,
    });

    //console.log("Token:", token);

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Server error" });
  }
};


