import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../../../domain/repositories/customer/IOrderRepository";
import { IWalletRepository } from "../../../../domain/repositories/IWalletRepository"; // update path as needed
import { OtpService } from "../../../services/OtpService";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { EmailService } from "../../../services/EmailService";

@injectable()
export class EndServiceWithInvoiceUsecase {
  constructor(
    @inject("IOrderRepository") private orderRepository: IOrderRepository,
    @inject("OtpService") private otpService: OtpService,
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("EmailService") private emailService: EmailService
  ) {}
  async execute(
    providerId: string,
   payload:{invoiceAmount: number,
      purchaseCharge: number,
      remainingCharge: number,
      bookingId: string,
      email: string}
  ) {
    const booking = await this.orderRepository.findById(payload.bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.providerId.toString() !== providerId.toString()) {
      throw new Error("Unauthorized access to cancel booking");
    }
    const updateFields: any = {
      bookingStatus: 'Completed',
      updatedAt: new Date(),
      $push: {
        statusHistory: {
          status:  'Completed',
          at: new Date(),
        },
        amount:{
            purchaseCharge:payload.purchaseCharge,
            finalInvoice:payload.invoiceAmount
        }
      },
    };
    console.log(JSON.stringify(updateFields)+" updated field")
    const updated = await this.orderRepository.updateById(
      payload.bookingId,
      updateFields
    );
        console.log(updated+"after updated field")

    // if (updated) {

    
    //   await this.emailService.sendOtpEmail(email, createOtp);
    // }
    return updated;
  }
}
