import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Admin from "../models/admin.js";
import app from "../index.js";
import bcrypt from 'bcrypt';
import request from "supertest";
import {describe, test, expect, beforeAll, afterAll } from '@jest/globals';
let jest;
(async () => {
  jest = await import("jest-mock");
})();

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

  const hashedPassword = await bcrypt.hash("secret", 1);

  
  const admin = new Admin({
    username: "test",
    password: hashedPassword
  });
  await admin.save();


  const response = await request(app)
    .post("/admin/login")
    .send({
      username: "test",
      password:"password13",
      confirm_password: "password13"
    });


  auth.token = response.body.token;
  auth.curr_admin_id = admin._id.toString();
});


// describe("Admin Controller", () => {
//   test("Register An Admin", async () => {
//     const res = await request(app)
//       .post("/admin/register")
//       .send({
//         username: "Carita Baby",
//         password: "password13",
//         confirm_password: "password13",
//       });

//      console.log("Response status:", res.status);
//  console.log("Response body:", res.body);

//     expect(res.status).toBe(201);
//     expect(res.body).toHaveProperty('msg', "Admin created successfully");
//   });
//   test('should return error if user already exists', async () => {
//     const admin = new Admin({
//       username: 'cari',
//       password: 'password13',
//       confirm_password: "password13",
//     });
//     await admin.save();

//     const res = await request(app)
//       .post('/admin/register')
//       .send({
//         username: 'cari',
//         password: 'password13',
//         confirm_password: "password13",
        
//       });

//     expect(res.status).toBe(400);
//     expect(res.body).toHaveProperty('error', 'Admin already exists');
//   });

//   test("if username is empty", async () => {
  
//     const user = {
//       username: "",
//         password: "password13",
//         confirm_password: "password13",
//     };

//     const res = await request(app).post('/admin/register').send(user);

//     expect(res.status).toBe(400);
//     expect(res.body.Error).toEqual("Username is required")
//   });

//   test('should return server error on exception', async () => {
//     jest.spyOn(Admin, 'findOne').mockImplementationOnce(() => {
//       throw new Error('Server error');
//     });

//     const res = await request(app)
//       .post('/auth/register')
//       .send({
//         username: 'erroruser',
//         password: 'password13',
//         confirm_password: "password13",
//       });

//     expect(res.status).toBe(500);
//     expect(res.body).toHaveProperty('error', 'Server error');
//   });
  
// });


describe("Admin Login ", () => {
  let admin;

  beforeEach(async () => {
    admin = new Admin({
      username: "testuser",
      password: await bcrypt.hash("password12", 10), 
    });
    await admin.save();
  });

  afterEach(async () => {
    await Admin.deleteMany();
  });

//   test("should login successfully", async () => {
//     const res = await request(app)
//       .post("/admin/login")
//       .send({
//         username: "MyAdmin",
//         password: "password12",
//       });

//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty("msg", "user login successful");
//     expect(res.body).toHaveProperty("token");
//     expect(res.body.user).toHaveProperty("username", "MyAdmin");
//   });
  test('if Password is not provided', async()=>{
    const user = {
      username: "Carita Baby",
        password: "",
        
    };
    const res = await request(app).post('/admin/login').send(user);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error','\"password\" is not allowed to be empty')
  });

//   test("should return error for invalid username", async () => {
//     const res = await request(app)
//       .post("/admin/login")
//       .send({
//         username: "notAnAdmin",
//         password: "password12",
//       });

//     expect(res.status).toBe(400);
//     expect(res.body).toHaveProperty("error", "Invalid credentials");
//   });

  test("should return error for invalid password", async () => {
    const res = await request(app)
      .post("/admin/login")
      .send({
        username: "MyAdmin",
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
      .post("/admin/login")
      .send({
        username: "testAdmin",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should return server error on exception", async () => {
    jest.spyOn(Admin, "findOne").mockImplementationOnce(() => {
      throw new Error("Server error");
    });

    const res = await request(app)
      .post("/admin/login")
      .send({
        username: "testAdmin",
        password: "password12",
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});