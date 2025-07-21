import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../../../domain/repositories/customer/IOrderRepository";
import { IWalletRepository } from "../../../../domain/repositories/IWalletRepository"; // update path as needed
import { OtpService } from "../../../services/OtpService";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { EmailService } from "../../../services/EmailService";

@injectable()
export class BookingOtpVerifyUsecase {
  constructor(
    @inject("IOrderRepository") private orderRepository: IOrderRepository,
    @inject("OtpService") private otpService: OtpService,
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("EmailService") private emailService: EmailService
  ) {}
  async execute(
  bookingId: string,
  email: string,
  otp: string,
  providerId: string,
) {
  const providerData = await this.userRepository.findById(bookingId);
  const provider = providerData?.fullname || "";

  const booking = await this.orderRepository.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.providerId.toString() !== providerId.toString()) {
    throw new Error("Unauthorized access to cancel booking");
  }

  const verifyOt = await this.otpService.verifyBookingOtp(
    bookingId,
    email,
    otp
  );

  if (!verifyOt) {
    const error = new Error("OTP verification failed. Not a verified provider.");
    (error as any).status = 400;
    throw error;
  }

  const updateFields: any = {
    bookingStatus: 'Ongoing',
    updatedAt: new Date(),
    $push: {
      statusHistory: {
        status: 'Ongoing',
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

    await this.emailService.bookedProviderVerify(provider, email);
  }

  return updated;
}

}
