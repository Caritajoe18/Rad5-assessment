import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.js";
import app from "../index.js";
import bcrypt from 'bcrypt';
import request from "supertest";
import {describe, test, expect, beforeAll, afterAll,jest } from '@jest/globals';
// let jest;
// (async () => {
//   jest = await import("jest-mock");
// })();

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
  // Hash the password
  const hashedPassword = await bcrypt.hash("secret", 1);

  // Insert the user into the database
  const user = new User({
    username: "test",
    password: hashedPassword
  });
  await user.save();


  const response = await request(app)
    .post("/login")
    .send({
      username: "test",
      password:"password13",
      confirm_password: "password13"
    });


  auth.token = response.body.token;
  auth.curr_user_id = user._id.toString();
});





////////////////
describe("User Controller", () => {
  test("GET / should fetch all the users", async () => {
    const users = await User.find();
    expect(users).toBeDefined();
  });

  test("Register Users", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        username: "Carita Baby",
        password: "password13",
        confirm_password: "password13",
      });

    // console.log("Response status:", res.status);
    // console.log("Response body:", res.body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('msg', "user created successfully");
  });
  test('should return error if user already exists', async () => {
    const user = new User({
      username: 'cari',
      password: 'password13',
      confirm_password: "password13",
    });
    await user.save();

    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'cari',
        password: 'password13',
        confirm_password: "password13",
        
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'User already exists');
  });

  test("if username is empty", async () => {
  
    const user = {
      username: "",
        password: "password123",
        confirm_password: "password123",
    };

    const res = await request(app).post('/auth/register').send(user);

    expect(res.status).toBe(400);
    expect(res.body.Error).toEqual("Username is required")
  });

  test('should return server error on exception', async () => {
    jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'erroruser',
        password: 'password13',
        confirm_password: "password13",
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Server error');
  });
  
});


describe("Login ", () => {
  let user;

  beforeEach(async () => {
    user = new User({
      username: "testuser",
      password: await bcrypt.hash("password12", 10), 
    });
    await user.save();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  test("should login successfully", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        username: "testuser",
        password: "password12",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("msg", "user login successful");
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("username", "testuser");
  });
  test('if Password is not provided', async()=>{
    const user = {
      username: "Carita Baby",
        password: "",
        
    };
    const res = await request(app).post('/auth/login').send(user);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error','\"password\" is not allowed to be empty')
  });

  test("should return error for invalid username", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        username: "invaliduser",
        password: "password12",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  test("should return error for invalid password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        username: "testuser",
        password: "invalidpassword",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Password must be between 5 and 10 characters and contain only letters and numbers");
  });

  test("should return validation error for missing username", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        password: "password123",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should return validation error for missing password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        username: "testuser",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should return server error on exception", async () => {
    jest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Server error");
    });

    const res = await request(app)
      .post("/auth/login")
      .send({
        username: "testuser",
        password: "password12",
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});