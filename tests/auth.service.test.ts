import { verifyOtpService, signinService } from "../src/services/auth.service";
import { redisClient } from "../src/config/redis";
import * as userRepo from "../src/repositories/user.repository";
import * as jwtUtil from "../src/utils/jwt.util";
import bcrypt from "bcrypt";

jest.mock("../src/config/redis");
jest.mock("../src/repositories/user.repository");
jest.mock("../src/utils/jwt.util");
jest.mock("bcrypt");

describe("Auth Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should verify OTP successfully", async () => {
    (redisClient.get as jest.Mock).mockResolvedValue("123456");
    (userRepo.setUserAsVerified as jest.Mock).mockResolvedValue({});

    await expect(
      verifyOtpService("test@mail.com", "123456")
    ).resolves.toBeUndefined();

    expect(redisClient.del).toHaveBeenCalledWith("otp:test@mail.com");
  });

  it("should throw error for invalid OTP", async () => {
    (redisClient.get as jest.Mock).mockResolvedValue("999999");

    await expect(
      verifyOtpService("test@mail.com", "123456")
    ).rejects.toThrow("Either Invalid OTP or Expired OTP");
  });

  it("should generate JWT tokens on successful signin", async () => {
    const fakeUser: any = {
      _id: "user123",
      email: "test@mail.com",
      password: "hashed",
      status: "Verified",
    };

    (userRepo.findUserByEmail as jest.Mock).mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (jwtUtil.generateTokens as jest.Mock).mockReturnValue({
      accessToken: "access",
      refreshToken: "refresh",
    });

    const tokens = await signinService("test@mail.com", "123456");

    expect(tokens.accessToken).toBe("access");
    expect(tokens.refreshToken).toBe("refresh");
  });

});
