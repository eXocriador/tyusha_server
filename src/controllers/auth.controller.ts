import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';

export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    const userExists = await User.findOne({ email });
    if (userExists) return reply.status(400).send({ message: 'Користувач вже існує' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword });

    reply.status(201).send({ _id: user._id, email: user.email, token: generateToken(user._id.toString()) });
};

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    const user = await User.findOne({ email });
    if (!user || !user.password) return reply.status(400).send({ message: 'Невірний email або пароль' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return reply.status(400).send({ message: 'Невірний email або пароль' });

    reply.send({ _id: user._id, email: user.email, token: generateToken(user._id.toString()) });
};
