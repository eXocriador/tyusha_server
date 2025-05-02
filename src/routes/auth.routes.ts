import express from "express";
import passport from "passport";
import { registerUser, loginUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        // @ts-ignore
        const user = req.user;
        res.json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id.toString())
        });
    }
);

export default router;
