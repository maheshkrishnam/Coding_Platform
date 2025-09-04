import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// use :: use is generally used for middlewares
// for cross origin sharing for all origin belonging to CORS_ORIGIN 
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// to parse the json and make it available in req.body and setting limit on the recieving payload
app.use(express.json({
  limit: "16kb",
}));

// encode the url
app.use(express.urlencoded({
  extended: true,
  limit: "16kb"
}));

// to store local files in public directory
app.use(express.static("public"));
app.use(cookieParser());

// routes
import userRouter from "./routes/user.routes.js";
import algoRouter from "./routes/algorithm.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/execution.routes.js";
import contestRoutes from "./routes/contest.routes.js";

// routes declaration
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
app.use("/users", userRouter);
app.use('/algorithms', algoRouter);
app.use("/problem", problemRoutes);
app.use("/execute", executionRoute);
app.use('/contests', contestRoutes);

export default app;