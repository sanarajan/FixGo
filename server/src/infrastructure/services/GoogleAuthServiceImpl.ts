import { OAuth2Client } from 'google-auth-library';
import { injectable } from 'tsyringe';
import { GoogleAuthService } from '../../domain/services/GoogleAuthService';

@injectable()
export class GoogleAuthServiceImpl implements GoogleAuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyToken(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
      throw new Error("Invalid Google token payload");
    }

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  }
}
