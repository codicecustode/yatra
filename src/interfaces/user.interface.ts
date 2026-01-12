import { Document } from 'mongoose';

export interface IUser extends Document {
  id?: string;
  email: string;
  password: string;
  status: 'Verified' | 'Unverified';
  createdAt: Date;
  updatedAt: Date;
}