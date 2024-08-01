import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcrypt";
import request from "supertest";
import Admin from "../models/admin.js";
import User from "../models/user.js";
import Todo from "../models/todo.js";
import app from "../index.js";
import jwt from "jsonwebtoken";
import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";

let mongoServer;

const dbConnect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {});
};

const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

beforeAll(async () => await dbConnect());
afterAll(async () => await dbDisconnect());

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

let auth = {};

beforeEach(async function () {
  const hashedPassword = await bcrypt.hash("secret", 1);

  const admin = new Admin({
    username: "test",
    password: hashedPassword,
  });
  await admin.save();

  const response = await request(app).post("/admin/login").send({
    username: "test",
    password: "password12",
  });

  auth.token = response.body.token;
  auth.curr_admin_id = admin._id.toString();
});

describe("GET /auth/users", () => {
  it("should fetch all users successfully", async () => {
    const mockUsers = [
      { _id: "1", username: "user1", isAdmin: false },
      { _id: "2", username: "user2", isAdmin: true },
    ];

    jest.spyOn(User, "find").mockResolvedValue(mockUsers);

    const res = await request(app)
      .get("/admin/users")
      .set("Authorization", `Bearer ${auth.token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body.users.length).toBe(2);
    expect(res.body.users[0].username).toBe("user1");
  });

  it("should return 500 if there is a server error", async () => {
    jest.spyOn(User, "find").mockRejectedValue(new Error("Server error"));

    const res = await request(app)
      .get("/admin/users")
      .set("Authorization", `Bearer ${auth.token}`);
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});

describe("GET /auth/todos", () => {
  it("should fetch all todos successfully", async () => {
    const mockTodos = [
      {
        _id: "1",
        title: "Todo 1",
        description: "Description for Todo 1",
        dueDate: "2024-07-01",
        status: false,
      },
      {
        _id: "2",
        title: "Todo 2",
        description: "Description for Todo 2",
        dueDate: "2024-07-02",
        status: true,
      },
    ];

    jest.spyOn(Todo, "find").mockResolvedValue(mockTodos);

    const res = await request(app)
      .get("/admin/todos")
      .set("Authorization", `Bearer ${auth.token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("todos");
    expect(res.body.todos.length).toBe(2);
    expect(res.body.todos[0].title).toBe("Todo 1");
  });

  it("should return 500 if there is a server error", async () => {
    jest.spyOn(Todo, "find").mockRejectedValue(new Error("Server error"));

    const res = await request(app).get("/admin/todos");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});
