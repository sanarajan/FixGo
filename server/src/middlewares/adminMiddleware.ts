import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AuthService } from '../application/services/AuthService';

export const adminAuthProtect = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {  
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!accessToken) {
    res.status(401).json({ message: 'Access token missing' });
    return;
  }
  const authService = container.resolve<AuthService>('AuthService');
  try {
    const payload =await authService.verifyAccessToken(accessToken);
   
    (req as any).user = payload; // attach user info for later use
    next();
  } catch (err: any) {
    console.error('Access token verification failed:', err.message);
    res.status(401).json({ message: 'Access token invalid or expired' });
  }
};