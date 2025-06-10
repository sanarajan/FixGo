export interface OtpService {
  generateAndSaveOtp(email: string): Promise<string>;
  validateOtp(email: string, userOtp: string): Promise<boolean>;
}