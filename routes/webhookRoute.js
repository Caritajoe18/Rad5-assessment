import express from "express";
import { webHooks } from "../controller/userController.js";

const router = express.Router();

router.post("/webhook", webHooks);

export default router;
