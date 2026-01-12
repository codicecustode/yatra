import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_JWT_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_JWT_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export const generateTokens = (userId: string, jti: string) => {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: ACCESS_JWT_EXPIRES_IN as any,
  });

  const refreshToken = jwt.sign({ userId, jti }, REFRESH_SECRET, {
    expiresIn: REFRESH_JWT_EXPIRES_IN as any,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as any;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as any;
};
