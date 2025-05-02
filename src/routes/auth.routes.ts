import { FastifyInstance } from 'fastify';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/api/auth/register', registerUser);
    fastify.post('/api/auth/login', loginUser);

    fastify.get('/api/auth/me', async (request, reply) => {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return reply.status(401).send({ message: "No token provided" });
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey") as {
                userId: string;
            };

            const user = await UserModel.findById(decoded.userId).select("_id email");
            if (!user) {
                return reply.status(404).send({ message: "User not found" });
            }

            return { _id: user._id, email: user.email };

        } catch (error) {
            console.error("GET /me error:", error);
            return reply.status(401).send({ message: "Invalid token" });
        }
    });
}
