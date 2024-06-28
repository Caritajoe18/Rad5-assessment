import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import webhookRoute from "./routes/webhookRoute.js";
import { getNextTasks } from "./controller/todoController.js";

dotenv.config();
connectDB();

//console.log('JWT_SECRET:', process.env.JWT_SECRET);



const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.send("Welcome to my Todo");
});


app.use("/auth", userRoutes );
app.use("/", todoRoutes)
app.use("/admin", adminRoutes)
app.use("/", webhookRoute)
app.use("/tasks/next-three", getNextTasks)


app.use(function (req, res, next) {
    next(createError(404));
  });

  const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

  export default app