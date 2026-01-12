import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  return await User.create(userData);
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const setUserAsVerified = async (email: string): Promise<IUser | null> => {
  return await User.findOneAndUpdate(
    { email },
    { status: 'Verified' },
    { new: true }
  );
};

export const getVerifiedUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email, status: 'Verified' });
};
