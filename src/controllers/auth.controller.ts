import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

export const getMe = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey") as {
      userId: string;
    };

    const user = await UserModel.findById(decoded.userId).select("_id email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ _id: user._id, email: user.email });
  } catch (error) {
    console.error("GET /me error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
