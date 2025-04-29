import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'customer' | 'warehouse_staff' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'warehouse_staff', 'admin'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);