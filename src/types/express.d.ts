import { IUser } from "../interfaces/user.interface"; // or whatever your user type is

declare global {
  namespace Express {
    interface Request {
      user?: IUser;  // or your actual type
    }
  }
}

export {};
