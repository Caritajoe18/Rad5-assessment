import express from "express";
import { adminLogin, getAllTodos, getAllUsers } from "../controller/adminController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", adminAuth, getAllUsers); 
router.get("/todos", adminAuth, getAllTodos); 

export default router;
