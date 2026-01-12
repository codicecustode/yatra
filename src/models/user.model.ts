import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    status: {
      type: String,
      enum: ['Verified', 'Unverified'],
      default: 'Unverified',
    },
  },
  {
    timestamps: true, 
  }
);


const User = model<IUser>('User', userSchema);

export default User;