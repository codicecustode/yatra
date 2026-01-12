import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CommonJS already provides __dirname
app.use("/uploads", express.static("./uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
