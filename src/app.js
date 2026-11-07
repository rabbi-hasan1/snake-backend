import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/user.route.js";
import errorHandler from "./utils/globalErrorHandler.js";
dotenv.config();
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    success: false,
    message: "Too many requests. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: "GET, POST, PATCH, PUT, DELETE",
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.send("server is working");
});

//user Routes
app.use("/api/v2/auth", userRouter);
app.use(errorHandler);
export default app;
