export interface GoogleAuthService {
    verifyToken(token: string): Promise<{
      email: string;
      name: string;
      picture?: string;
    }>;
  }
  