import { createTodoSchema, updateTodoSchema } from "../validators/userValid.js";
import Todo from "../models/todo.js";
import User from "../models/user.js";

export const createTodo = async (req, res) => {
  try {
    const verified = req.user;

    const validateTodo = createTodoSchema.validate(req.body);

    if (validateTodo.error) {
      return res
        .status(400)
        .json({ Error: validateTodo.error.details[0].message });
    }

    const Todos = await Todo.create({
      ...req.body,
      user: req.user._id,
    });

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("useeee", user);
    user.todos.push(Todos._id);
    await user.save();

    return res.status(201).json({
      msg: "Todo created successfully",
      Todos,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getTodos = async (req, res) => {
  try {
    //const userId = req.user._id;
    console.log(req.user);

    const user = await User.findById(req.user._id).populate("todos");
    if (!user) {
      return res.status(404).json({ error: "No todos found for this user" });
    }

    return res.status(200).json({
      msg: "Todos fetched successfully",
      todos: user.todos,
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

    const validateTodo = updateTodoSchema.validate(req.body);
    if (validateTodo.error) {
      return res.status(400).json({
        error: validateTodo.error.details[0].message,
      });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, dueDate, status },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        error: "Task not found",
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
    const userId = req.user._id;

    //console.log("userId:", userId); 
    
    const user = await User.findById(userId).populate("todos");

    if (!user) {
      return res.status(404).json({ error: "No todos found for this user" });
    }

    user.todos.forEach((todo) => {
      todo.dueDate = new Date(todo.dueDate);
    });

    user.todos.sort((a, b) => a.dueDate - b.dueDate);

    const firstThreeTodos = user.todos.slice(0, 3);

    return res.status(200).json({
      msg: "Todos fetched successfully",
      todos: firstThreeTodos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
