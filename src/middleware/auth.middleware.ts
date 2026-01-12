import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import * as userRepository from '../repositories/user.repository';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        message: 'Access token missing in header or cookie',
      });
    }

    const decoded = verifyAccessToken(token) as { userId: string } | null;

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }

    const user = await userRepository.findUserById(decoded.userId);

    if (!user || user.status !== 'Verified') {
      return res.status(403).json({
        message: 'User not verified or does not exist',
      });
    }

    (req as any).user = { id: user._id };

    next();
  } catch (error) {
    
    res.status(500).json({ message: 'Internal server error' });
  }
};
