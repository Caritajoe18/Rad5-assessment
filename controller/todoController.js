import { createTodoSchema, updateTodoSchema } from "../validators/userValid.js";
import Todo from "../models/todo.js";
//import User from "../models/user.js";

export const createTodo = async (req, res) => {
  try {
    const { error } = createTodoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const todo = await Todo.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(201).json({
      msg: "Todo created successfully",
      todo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getTodos = async (req, res) => {
  try {
    const userId = req.user._id;
    const todos = await Todo.find({ user: userId }).populate("user");

    if (todos.length == 0) {
      return res.status(200).json({ msg: "No todos found for this user" });
    }
    return res.status(200).json({
      msg: "Todos fetched successfully",
      todos: todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    const { error } = updateTodoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to update this todo",
      });
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id },
      { title, description, dueDate, status },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        error: "Task not found after update",
      });
    }

    return res.status(200).json({
      msg: "You have updated your task",
      taskUpdate: updatedTodo,
    });
  } catch (err) {
    console.error("Error updating todo:", err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    //console.log(todo, "ttttttt");

    if (todo.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this todo" });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.status(200).json({
      msg: "You have deleted your Task",
      deletedTodo,
    });
  } catch (err) {
    console.error("Error deleting todo:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getNextTasks = async (req, res) => {
  try {
    //console.log(req.user, "uuuuuu");

    const tasks = await Todo.find({ user: req.user._id })
      .sort({ dueDate: 1 })
      .limit(3);

    if (tasks.length < 3) {
      return res.status(200).json({
        msg: "Your tasks are not up to three",
        todos: tasks,
      });
    }

    return res.status(200).json({
      msg: "Your first three tasks fetched successfully",
      todos: tasks,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
