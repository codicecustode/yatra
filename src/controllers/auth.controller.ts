import { Request, Response } from "express";
import {
  signupService,
  verifyOtpService,
  signinService,
  refreshService,
  logoutService,
} from "../services/auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    await signupService(req.body.email, req.body.password);
    return res.status(201).json({
      message: "OTP sent to email. Kindly check your email for verification.",
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    await verifyOtpService(req.body.email, req.body.otp);
    return res.status(200).json({ message: "Account verified" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const tokens = await signinService(req.body.email, req.body.password);

    //set secure cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json(tokens);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

const refresh = async (req: Request, res: Response) => {
  try {

    const tokens = await refreshService(req.body.refreshToken);
    //set secure cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json(tokens);
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body?.refreshToken || req.cookies.refreshToken;

    await logoutService(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export { signin, signup, logout, refresh, verifyOtp };
