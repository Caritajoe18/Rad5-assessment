import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";
import bcrypt from "bcrypt";
import User from "../models/user.js"; 
import app from "../index.js"; 

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

describe('POST /register', () => {
  beforeEach(async () => {
    // Ensure the database is clean before each test
    await User.deleteMany({});
  });

  it('should return 201 and create a new user', async () => {
    const response = await supertest(app)
      .post('/auth/register')
      .send({ username: 'carita baby', password: '1239876asb' });

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe('user created successfully');
    expect(response.body.newUser).toHaveProperty('username', 'carita baby');
  });

  it('should return 400 if user already exists', async () => {
    await User.create({ username: 'existinguser', password: await bcrypt.hash('password123', 10) });

    const response = await supertest(app)
      .post('/auth/register')
      .send({ username: 'existinguser', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User already exists');
  });

  it('should return 400 if validation fails', async () => {
    const response = await supertest(app)
      .post('/auth/register')
      .send({ username: '', password: 'short' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('Error');
  });

  
});
