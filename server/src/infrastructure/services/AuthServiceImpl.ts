import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";
import { AuthService } from "../../application/services/AuthService";
import { User } from "../../domain/models/User";
import { AuthPayload } from "../../domain/models/AuthPayload"; // you might need to create this interface
import crypto from "crypto";

@injectable()
export class AuthServiceImpl implements AuthService {
  generateTokens(user: User) {
    const payload = { id: user._id, role: user.role };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token: string): AuthPayload {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as AuthPayload;
  }
  verifyAccessToken(token: string): AuthPayload {
    return jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
  }
  generateAccessToken(payload: AuthPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });
  }
   generateForgotToken(): string {
      return crypto.randomBytes(32).toString("hex");
    }
}
