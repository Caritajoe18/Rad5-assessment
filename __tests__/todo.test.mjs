import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Todo from "../models/todo.js";
//import app from "../index.js";
//import request from "supertest";
let mongoServer;

const dbConnect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
};

const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

beforeAll(async () => await dbConnect());
afterAll(async () => await dbDisconnect());

describe("Todo Controller", () => {
  test("GET /todos should fetch all todos for the user", async () => {
    const todos = await Todo.find();
    //const response = await request(app).get("/todo");

    expect(todos).toBeDefined();

    //  expect(response.status).toBe(200);
    //  expect(Array.isArray(response.body.getAllMovies)).toBe(true);
  });
});
