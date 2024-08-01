import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Todo from "../models/todo.js";
import User from "../models/user.js"; // Import the User model
import app from "../index.js";
import bcrypt from "bcrypt";
import request from "supertest";
import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

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

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

let auth = {};

beforeEach(async function() {
  // Create a mock user for authorization
  const user = await User.create({
    username: "testuser",
    password: await bcrypt.hash("password123", 10), // Hash the password
  });

  // Generate a token for the created user
  auth.token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '14d' });

  // Create a todo item for the authenticated user
  const todo = new Todo({
    title: "coding",
    description: "one or two",
    dueDate: "2024-08-01",
    user: user._id // Assign the user to the todo
  });
  await todo.save();
});

// test("GET /todos should fetch all todos for the user", async () => {
//   const response = await request(app)
//     .get("/todo") 
//     .set("Authorization", `Bearer ${auth.token}`); 
//   expect(response.status).toBe(200);
//   expect(Array.isArray(response.body.todos)).toBe(true);
// });

// test("PUT /todo/:id should update a todo", async () => {
//   const todoToUpdate = await Todo.findOne(); 
//   const updatedData = {
//     title: "Updated Title",
//     description: "Updated Description",
//     dueDate: "2024-08-02",
//   };

//   const response = await request(app)
//     .put(`/todo/${todoToUpdate._id}`)
//     .set("Authorization", `Bearer ${auth.token}`)
//     .send(updatedData);

//   expect(response.status).toBe(200);
//   expect(response.body.msg).toBe("You have updated your task");
//   expect(response.body.taskUpdate.title).toBe(updatedData.title);
// });



// // describe("Todo Api", () => {
// //   let user;
// //   let token;

// //   beforeAll(async () => {
// //     // Create a mock user
// //     user = await User.create({
// //       username: "testuser",
// //       password: "password123",
// //       todos: []
// //     });

  
// //     token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //   });

// //   test("if title is empty", async () => {
// //     const todo = {
// //       title: "",
// //       description: "coding",
// //       dueDate: "2024-08-20"
// //     };

// //     const res = await request(app)
// //       .post("/todo")
// //       .set("Authorization", `Bearer ${token}`)
// //       .send(todo);

// //     expect(res.status).toBe(400);
// //     expect(res.body.Error).toEqual("Title is required");
// //   });

// //   test("if date is not in the right format", async () => {
// //     const todo = {
// //       title: "Code",
// //       description: "coding",
// //       dueDate: "jun 28, 2024"
// //     };

// //     const res = await request(app)
// //       .post("/todo")
// //       .set("Authorization", `Bearer ${token}`)
// //       .send(todo);

// //     expect(res.status).toBe(400);
// //     expect(res.body.Error).toEqual("Due date must be in YYYY-MM-DD format");
// //   });

// //   test("create a todo", async () => {
// //     const todo = {
// //       title: "New Todo",
// //       description: "Write tests",
// //       dueDate: "2024-08-20"
// //     };

// //     const res = await request(app)
// //       .post("/todo")
// //       .set("Authorization", `Bearer ${token}`)
// //       .send(todo);

// //     expect(res.status).toBe(201);
// //     expect(res.body).toHaveProperty('msg', 'Todo created successfully');
// //     expect(res.body.Todos).toHaveProperty('_id');
// //     expect(res.body.Todos).toHaveProperty('title', 'New Todo');
// //     expect(res.body.Todos).toHaveProperty('description', 'Write tests');
// //     expect(res.body.Todos).toHaveProperty('dueDate');
// //   });

// //   afterAll(async () => {
// //     await User.deleteMany({});
// //     await Todo.deleteMany({});
// //   });
// // });
