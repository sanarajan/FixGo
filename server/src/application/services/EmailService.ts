export interface EmailService {
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendGenericEmail(to: string, subject: string, body: string): Promise<void>;
    sendForgotEmail(email: string, link: string): Promise<boolean>;

  }