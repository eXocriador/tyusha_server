import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { connectDB } from "./config/db";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Підключення до MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Tyusha API працює!");
});

app.use("/api/auth", authRoutes);

export default app;
