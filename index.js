import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();
connectDB();

console.log('JWT_SECRET:', process.env.JWT_SECRET);



const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to my Todo");
});


app.use("/auth", userRoutes );
// app.use("/",)


app.use(function (req, res, next) {
    next(createError(404));
  });

  const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

  export default app