import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Користувач вже існує" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ email, password: hashedPassword });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id.toString())
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ message: "Невірний email або пароль" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Невірний email або пароль" });
        }

        res.json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id.toString())
        });
    } catch (error) {
        next(error);
    }
};
