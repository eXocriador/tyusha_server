import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            callbackURL: "/api/auth/google/callback"
        },
        async (_accessToken, _refreshToken, profile, done) => {
            const email = profile.emails?.[0]?.value;

            if (!email) {
                return done(new Error("No email found"), null);
            }

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    email,
                    googleId: profile.id
                });
            }

            return done(null, user);
        }
    )
);
