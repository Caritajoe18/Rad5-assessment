import mongoose from "mongoose";

const mongoURI = 'mongodb://localhost/My-todos';

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(mongoURI);
    console.log(`Connected to MongoDB: ${connect.connection.host}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    
  }
};

export default connectDB;
