export interface OtpService {
    generateOtp(): string;
    validateOtp(otp: string, userOtp: string): boolean;
  }
  