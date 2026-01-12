import request from "supertest";
import app from "../src/app";
import * as authService from "../src/services/auth.service";

jest.mock("../src/services/auth.service");

describe("Auth Controller Verify OTP", () => {

  it("should return 200 for valid OTP", async () => {
    (authService.verifyOtpService as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .post("/api/auth/verify")
      .send({ email: "test@mail.com", otp: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Account verified");
  });

  it("should return 400 for invalid OTP", async () => {
    (authService.verifyOtpService as jest.Mock).mockRejectedValue(
      new Error("Invalid OTP")
    );

    const res = await request(app)
      .post("/api/auth/verify")
      .send({ email: "test@mail.com", otp: "000000" });

    expect(res.status).toBe(400);
  });

});
