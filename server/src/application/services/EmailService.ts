export interface EmailService {
  sendOtpEmail(email: string, otp: string): Promise<void>;
  sendGenericEmail(to: string, subject: string, body: string): Promise<void>;
  sendForgotEmail(email: string, link: string): Promise<boolean>;
  rejectVerify(
    user: string | null,
    email: string,
    content: string
  ): Promise<boolean>;
  bookedProviderVerify(provider: string, email: string): Promise<boolean>;
  passwordSend(staff: string, email: string,password:string,providerName:string): Promise<boolean>;
}
