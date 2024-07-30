import request from 'supertest';
import app from "../index.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {describe, expect, jest, it} from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

jest.mock('fs'); 


// jest.mock('fs', () => ({
//     appendFileSync: jest.fn(),
//     // You can add other fs methods here if necessary
//   }));
//    // Mock the fs module

describe('Webhook Handling', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  // it('should respond with 200 and log the event for valid payload', async () => {
  //   const eventType = 'USER_REGISTERED';
  //   const data = { username: 'testuser' };

  //   const logFilePath = path.join(__dirname, '../logs/webhook.log');

  //   // Mock the appendFileSync method
  //   fs.appendFileSync.mockImplementation((path, message) => {
  //       console.log(`Mock appendFileSync called with path: ${path} and message: ${message}`);
  //   });

  //   const response = await request(app)
  //     .post('/webhook') // Adjust the path to your webhook endpoint
  //     .send({ eventType, data });

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({ message: "Event received successfully" });
  //   expect(fs.appendFileSync).toHaveBeenCalledWith(
  //     logFilePath,
  //     expect.stringContaining(`Received event: ${eventType}`)
  //   );
  // });

  it('should respond with 400 for invalid payload', async () => {
    const response = await request(app)
      .post('/webhook')
      .send({}); 
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid webhook payload" });
  });

  // it('should respond with 500 for errors during processing', async () => {
   
  //   fs.appendFileSync.mockImplementation(() => {
  //     throw new Error('File write error');
  //   });

  //   const response = await request(app)
  //     .post('/webhook')
  //     .send({ eventType: 'TEST_EVENT', data: {} });

  //   expect(response.status).toBe(500);
  //   expect(response.body).toEqual({ message: "Internal Server Error" });
  // });
});