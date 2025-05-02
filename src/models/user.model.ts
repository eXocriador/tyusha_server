import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    password?: string;
    googleId?: string;
    appleId?: string;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    appleId: { type: String }
});

export const User = mongoose.model<IUser>("User", userSchema);
