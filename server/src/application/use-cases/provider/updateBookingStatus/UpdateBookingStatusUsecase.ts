import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../../../domain/repositories/customer/IOrderRepository";
import { IWalletRepository } from "../../../../domain/repositories/IWalletRepository"; // update path as needed
import { OtpService } from "../../../services/OtpService";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { EmailService } from "../../../services/EmailService";

@injectable()
export class UpdateBookingStatusUsecase {
  constructor(
    @inject("IOrderRepository") private orderRepository: IOrderRepository,
    @inject("OtpService") private otpService: OtpService,
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("EmailService") private emailService: EmailService
  ) {}
  async execute(
    providerId: string,
    bookingId: string,
    bookingStatus: string,
    email: string
  ) {
    const booking = await this.orderRepository.findById(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.providerId.toString() !== providerId.toString()) {
      throw new Error("Unauthorized access to cancel booking");
    }
    const updateFields: any = {
      bookingStatus: bookingStatus,
      updatedAt: new Date(),
      $push: {
        statusHistory: {
          status: bookingStatus,
          at: new Date(),
        },
      },
    };
    const updated = await this.orderRepository.updateById(
      bookingId,
      updateFields
    );
    if (updated) {

      const isExistEmail = await this.userRepository.emailVerification(
        email,
        "customer"
      );
      if (!isExistEmail) {
        const error = new Error("Invalid User");
        (error as any).status = 400;
        throw error;
      }
      const createOtp = await this.otpService.generateBookingOtp(
        email,
        bookingId
        
      );
      await this.emailService.sendOtpEmail(email, createOtp);
    }
    return updated;
  }
}
