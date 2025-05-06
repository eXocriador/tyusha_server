import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string; // ❗ Пароль може бути undefined для Google акаунтів
    googleId?: string;
    name?: string;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // тепер не обов'язковий
    googleId: { type: String },
    name: { type: String }
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;
