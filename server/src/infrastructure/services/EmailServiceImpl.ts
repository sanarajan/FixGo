import { injectable } from "tsyringe";
import nodemailer from "nodemailer";
import { EmailService } from "../../application/services/EmailService";

@injectable()
export class EmailServiceImpl implements EmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  public async sendOtpEmail(email: string, otp: string): Promise<void> {
    const subject = "Your OTP Code";
    const text = `Your OTP is ${otp}. It is valid for 5 minutes.`;

    await this.sendGenericEmail(email, subject, text);
  }
  public async sendForgotEmail(email: string, link: string): Promise<boolean> {
    const subject = "Reset Password";
    const text = `  <p>We received a request to reset your password.</p>
    <p><a href="${link}">Click here to reset your password</a></p>
    <p>This link will expire in 1 hour.</p>`;

    const send = await this.sendGenericEmail(email, subject, text);
    console.log(send+" send")
    return true
  }

  public async sendGenericEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
