import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.ts";
import connectDB from "./config/db.ts";
import "./utils/passport.ts";

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
}

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

connectDB();

export default app;
