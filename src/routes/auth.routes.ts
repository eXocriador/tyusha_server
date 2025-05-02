import { FastifyInstance } from 'fastify';
import { registerUser, loginUser } from '../controllers/auth.controller.js';

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/api/auth/register', registerUser);
    fastify.post('/api/auth/login', loginUser);
}
