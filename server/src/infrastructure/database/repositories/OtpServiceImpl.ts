import { injectable } from 'tsyringe';
// import { OtpService } from '../../../application/services/OtpService';
import {OtpService  } from "../../../domain/repositories/OtpServices"
@injectable()
export class OtpServiceImpl implements OtpService {
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();  // Generates a 6-digit OTP
  }

  validateOtp(expectedOtp: string, userOtp: string): boolean {
    return expectedOtp === userOtp;  // Compares the expected OTP with the user input
  }
}