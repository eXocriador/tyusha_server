import { FastifyRequest, FastifyReply } from "fastify";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return reply.status(400).send({ message: "Користувач вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ email, password: hashedPassword });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || "secretkey", {
        expiresIn: "7d"
    });

    return reply.send({ _id: newUser._id, email: newUser.email, token });
};

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    const user = await UserModel.findOne({ email });
    if (!user) {
        return reply.status(400).send({ message: "Користувача не знайдено" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return reply.status(401).send({ message: "Невірний пароль" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secretkey", {
        expiresIn: "7d"
    });

    return reply.send({ _id: user._id, email: user.email, token });
};
