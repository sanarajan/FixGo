
import { inject, injectable } from "tsyringe";
import { AuthService } from "../services/AuthService";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("AuthService") private authService: AuthService
  ) {}

  public execute(refreshToken: string): { accessToken: string; role: string,id:string }  {
    const payload = this.authService.verifyRefreshToken(refreshToken); //
    let accessToken=""
    if(payload.id)
      accessToken = this.authService.generateAccessToken({id:payload.id,role:payload.role});
    return { accessToken, role: payload.role ,id:payload.id};
  }
}
