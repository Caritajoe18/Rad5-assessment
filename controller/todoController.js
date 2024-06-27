import { createTodoSchema, option } from "../validators/userValid";
import Todo from "../models/todo.js"; // Make sure the path is correct

export const createTodo = async (req, res) => {
  try {
    const verified = req.user;
    const validateUser = createTodoSchema.validate(req.body, option);

    if (validateUser.error) {
      return res
        .status(400)
        .json({ error: validateUser.error.details[0].message });
    }

    const Todos = await Todo.create({
      ...req.body,
      user: verified._id,
    });

    return res.status(201).json({
      msg: "Movies created successfully",
      Todos,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
};
