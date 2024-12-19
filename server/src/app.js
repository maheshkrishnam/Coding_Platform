import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// use :: use is generally used for middlewares
// for cross origin sharing for all origin belonging to CORS_ORIGIN 
app.use(cors({
  origin: process.env.CORS_ORIGIN,
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

// routes declaration
app.use("/users", userRouter);

export default app;