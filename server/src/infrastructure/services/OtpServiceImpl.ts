import { OtpService } from "../../application/services/OtpService";
import { injectable } from "tsyringe";
import * as crypto from "crypto";
import Otp from '../../infrastructure/database/models/otpModel';


@injectable()
export class OtpServiceImpl implements OtpService {
  public async generateAndSaveOtp(email: string): Promise<string> {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 20  * 1000); // expires in 5 minutes

    // Delete existing OTPs for this email (optional)
    await Otp.deleteMany({ email });

    await Otp.create({ email, otp, expiresAt });

    return otp;
  }

  public async validateOtp(email: string, userOtp: string): Promise<boolean> {
    const record = await Otp.findOne({ email, otp: userOtp });
    if (!record) return false;
    // Valid OTP → delete it after use
    await Otp.deleteMany({ email });
    return true;
  }
}