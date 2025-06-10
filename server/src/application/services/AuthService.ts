import { User } from "../../domain/models/User";
import { AuthPayload } from "../../domain/models/AuthPayload"; // You can define this as { id: string; role: string }

export interface AuthService {
  generateTokens(user: User): { accessToken: string; refreshToken: string };
  verifyRefreshToken(token: string): AuthPayload;
  verifyAccessToken(token: string): AuthPayload;  
  generateAccessToken(payload: AuthPayload): string;
  generateForgotToken():string
}
