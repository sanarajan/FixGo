"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailServiceImpl = void 0;
const tsyringe_1 = require("tsyringe");
const nodemailer_1 = __importDefault(require("nodemailer"));
let EmailServiceImpl = class EmailServiceImpl {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
        });
    }
    async sendOtpEmail(email, otp) {
        const subject = "Your OTP Code";
        const text = `Your OTP is ${otp}. It is valid for 5 minutes.`;
        await this.sendGenericEmail(email, subject, text);
    }
    async sendForgotEmail(email, link) {
        const subject = "Reset Password";
        const text = `  <p>We received a request to reset your password.</p>
    <p><a href="${link}">Click here to reset your password</a></p>
    <p>This link will expire in 1 hour.</p>`;
        const send = await this.sendGenericEmail(email, subject, text);
        console.log(send + " send");
        return true;
    }
    async sendGenericEmail(to, subject, text) {
        const mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to,
            subject,
            text,
        };
        await this.transporter.sendMail(mailOptions);
    }
};
exports.EmailServiceImpl = EmailServiceImpl;
exports.EmailServiceImpl = EmailServiceImpl = __decorate([
    (0, tsyringe_1.injectable)()
], EmailServiceImpl);
//# sourceMappingURL=EmailServiceImpl.js.map