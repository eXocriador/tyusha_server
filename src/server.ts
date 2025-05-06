import Fastify from 'fastify';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import authRoutes from './routes/auth.routes.js';
import googleOAuthPlugin from './routes/oauth.routes.js';

dotenv.config();

const fastify = Fastify();

fastify.register(fastifyCors);
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'secret' });
fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok', message: 'Server is working!' };
});
fastify.ready(err => {
  if (err) throw err;
  console.log(fastify.printRoutes());
});


fastify.register(authRoutes);
fastify.register(googleOAuthPlugin);


const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('MongoDB connected');
        await fastify.listen({
            port: Number(process.env.PORT) || 5000,
            host: '0.0.0.0'
        });

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
