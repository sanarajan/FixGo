import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AuthService } from '../application/services/AuthService';

export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {  
 console.log("admins chheck middleware token")

    const userRole=  req.headers['userrole'];

    const refreshToken = req.cookies?.[`${userRole}_refreshToken`];
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        console.log(accessToken+" token exist still in provider")

  if (!accessToken) {
    res.status(401).json({ message: 'Access token missing' });
    return;
  }
  const authService = container.resolve<AuthService>('AuthService');
  try {
    const payload = authService.verifyAccessToken(accessToken);
    (req as any).user = payload; // attach user info for later use
    next();
  } catch (err: any) {
    console.error('Access token verification failed:', err.message);
    res.status(401).json({ message: 'Access token invalid or expired' });
  }
};