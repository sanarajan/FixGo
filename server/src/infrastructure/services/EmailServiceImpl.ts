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
    return true
  }

 public async rejectVerify(user:string,email: string, content: string): Promise<boolean> {
    const subject = `Staff ${user} Rejected by Admin`;

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h2 style="color: #dc3545;">Application Status: Rejected</h2>
          <p>Dear <strong>sir</strong>,</p>
          <p>We regret to inform you that  verification of your staff <strong>${user}</strong> has been <strong>rejected by the administrator</strong>.</p>
          
          <h4 style="color: #333;">Reason for Rejection:</h4>
          <div style="background-color: #f1f1f1; padding: 12px 16px; border-left: 4px solid #dc3545; margin-bottom: 20px;">
            <p style="margin: 0;">${content}</p>
          </div>

          <p>If you believe this decision was made in error or you would like to reapply, please feel free to contact us.</p>
          
          <p style="margin-top: 30px;">Best regards,<br><strong>Admin Team</strong></p>
        </div>
      </div>
    `;

    const send= await this.sendGenericEmail(email, subject, html);
    console.log(send+" send")
    return true
  }
  public async bookedProviderVerify(provider:string,email: string): Promise<boolean> {
    const subject = `FixGo Povider reached your home`;

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h2 style="color: #dc3545;">Application Status: Provider reached your location</h2>         
          
          <div style="background-color: #f1f1f1; padding: 12px 16px; border-left: 4px solid #dc3545; margin-bottom: 20px;">
            <p style="margin: 0;">${provider} is reached your location.The provider going to start work now.</p>
          </div>

          
          <p style="margin-top: 30px;">Best regards,<br><strong>FixGo Team</strong></p>
        </div>
      </div>
    `;

    const send= await this.sendGenericEmail(email, subject, html);
    console.log(send+" send")
    return true
  }
  public async passwordSend(staff: string, email: string,password:string,provider:string): Promise<boolean>{
     const subject = `FixGo Povider login credentials`;

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h2 style="color: #dc3545;"> Status: ${provider} Provider created you as a staff in FixGo. Your credentials for login are given below..</h2>         
          
          <div style="background-color: #f1f1f1; padding: 12px 16px; border-left: 4px solid #dc3545; margin-bottom: 20px;">
            <p style="margin: 0;">Username :${email}</p>
             <p style="margin: 0;">Password :${password}</p>
          </div>

          
          <p style="margin-top: 30px;">Best regards,<br><strong>FixGo Team</strong></p>
        </div>
      </div>
    `;

    const send= await this.sendGenericEmail(email, subject, html);
    console.log(send+" send")
    return true
  }
  public async sendGenericEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
