import { FastifyPluginAsync } from 'fastify';
import fastifyOauth2 from '@fastify/oauth2';
import UserModel from '../models/user.model.js';

const googleOAuthPlugin: FastifyPluginAsync = async (fastify) => {
  // Реєстрація Google OAuth
  fastify.register(fastifyOauth2, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID || '',
        secret: process.env.GOOGLE_CLIENT_SECRET || '',
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION
    },
    startRedirectPath: '/api/auth/google/login',
    callbackUri: process.env.GOOGLE_CALLBACK_URL || ''
  });

  // Обробка колбеку
  fastify.get('/api/auth/google/callback', async (req, reply) => {
    const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.token.access_token}` }
    });

    const profile = await userInfoResponse.json();

    const { id: googleId, email, name } = profile;

    // === Шукаємо по email ===
    let user = await UserModel.findOne({ email });

    if (!user) {
      // Якщо користувача нема — створюємо
      user = new UserModel({
        email,
        name,
        googleId
      });
    } else {
      // Якщо є, але googleId ще не збережений — додаємо
      if (!user.googleId) {
        user.googleId = googleId;
      }
    }

    await user.save();

    // Створення JWT
    const jwt = fastify.jwt.sign({ id: user._id, email: user.email });

    // Перенаправлення на фронтенд
    reply.redirect(`https://tyusha-client.vercel.app/oauth-success?token=${jwt}`);
  });
};

export default googleOAuthPlugin;
