import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: "30d",
  });
};
