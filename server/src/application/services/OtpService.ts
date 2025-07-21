export interface OtpService {
  generateAndSaveOtp(email: string): Promise<string>;
  validateOtp(email: string, userOtp: string): Promise<boolean>;
   generateBookingOtp(email: string,bookingId:string): Promise<string> 
verifyBookingOtp(bookingId:string,email: string, otp: string): Promise<boolean>
}