import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  setUserAsVerified,
} from "../repositories/user.repository";
import { redisClient } from "../config/redis";
import { sendOTPEmail } from "./mail.service";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.util";
import { v4 as uuidv4 } from "uuid";
import { sendEmailJob } from "../kafka/producer";

export const signupService = async (email: string, password: string) => {
  const isUserExist = await findUserByEmail(email);

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    email,
    password: hashedPassword,
    status: "Unverified",
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("OTP:", otp);

  await redisClient.setEx(`otp:${email}`, 300, otp);
  //produce message to Kafka topic
  await sendEmailJob(email, otp);
  return user;
};

export const verifyOtpService = async (email: string, otp: string) => {
  const storedOtp = await redisClient.get(`otp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    throw new Error("Either Invalid OTP or Expired OTP");
  }

  await setUserAsVerified(email);
  await redisClient.del(`otp:${email}`);
};

export const signinService = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.status !== "Verified") {
    throw new Error("User not verified");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const jti = uuidv4();
  const tokens = generateTokens(user._id.toString(), jti);

  await redisClient.setEx(`refresh:${jti}`, 604800, user._id.toString());

  return tokens;
};

export const refreshService = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  const exists = await redisClient.get(`refresh:${payload.jti}`);
  if (!exists) throw new Error("Session expired");

  return generateTokens(payload.userId, payload.jti);
};

export const logoutService = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  await redisClient.del(`refresh:${payload.jti}`);
};
