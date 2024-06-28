import dotenv from 'dotenv';
dotenv.config();

import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import { User } from "../models/user.js";
import { Todo } from "../models/todo.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let mongoServer;

const dbConnect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  collections.map(async (collection) => {
    await collection.deleteMany();
  });
});

const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

describe("Todo Controller", () => {
  let userToken;
  let userId;

  beforeEach(async () => {
    const hashedPassword = bcrypt.hashSync("12345", bcrypt.genSaltSync());
    const user = await User.create({
      username: "testuser",
      password: hashedPassword,
      todos: [],
    });

    userId = user._id;
    userToken = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });


    const todos = await Todo.insertMany([
      { title: "Todo 1", dueDate: new Date("2024-07-01"), user: user._id },
      { title: "Todo 2", dueDate: new Date("2024-06-30"), user: user._id },
      { title: "Todo 3", dueDate: new Date("2024-07-02"), user: user._id },
      { title: "Todo 4", dueDate: new Date("2024-06-29"), user: user._id },
    ]);

    user.todos = todos.map(todo => todo._id);
    await user.save();
  });

  test("GET /todos should fetch all todos for the user", async () => {
    const res = await request(app)
      .get("/todos")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.todos).toHaveLength(4);
  });

  
});
