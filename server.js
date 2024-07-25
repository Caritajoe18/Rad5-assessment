import app from './index.js';
import connectDB from './db.js';
import dotenv from 'dotenv'
dotenv.config();
connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
