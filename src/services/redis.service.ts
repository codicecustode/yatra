import { redisClient } from "../config/redis";

// Store OTP with 5 minutes expiry
export const storeOTP = async (email: string, otp: string): Promise<void> => {
  await redisClient.setex(`otp:${email}`, 300, otp);
};

// Get OTP for verification
export const getOTP = async (email: string): Promise<string | null> => {
  return await redisClient.get(`otp:${email}`);
};

// Delete OTP after successful verification
export const deleteOTP = async (email: string): Promise<void> => {
  await redisClient.del(`otp:${email}`);
};

// Store refresh token for 7 days
export const storeRefreshToken = async (
  userId: string,
  token: string
): Promise<void> => {
  await redisClient.setex(`refresh:${userId}`, 604800, token);
};

// Get refresh token for validation
export const getRefreshToken = async (
  userId: string
): Promise<string | null> => {
  return await redisClient.get(`refresh:${userId}`);
};

// Delete refresh token on logout
export const deleteRefreshToken = async (userId: string): Promise<void> => {
  await redisClient.del(`refresh:${userId}`);
};
