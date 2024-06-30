import express from "express";
import {createTodo, getTodos, deleteTodo, updateTodo, getNextTasks} from '../controller/todoController.js'
import { userAuth } from "../middlewares/userAuth.js";
 
const router = express.Router();

/* GET users listing. */
router.post("/todo",userAuth, createTodo );
router.get("/todo",userAuth, getTodos );
router.put("/todo/:id",userAuth, updateTodo );
router.delete("/todo/:id",userAuth, deleteTodo );
router.get("/tasks/next-three", userAuth, getNextTasks);


export default router;
