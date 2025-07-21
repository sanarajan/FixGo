import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../../../domain/repositories/customer/IOrderRepository";
import { IWalletRepository } from "../../../../domain/repositories/IWalletRepository"; // update path as needed

@injectable()
export class ProviderCancelBookingUseCase {
  constructor(
    @inject("IOrderRepository") private orderRepository: IOrderRepository,
      @inject("IWalletRepository") private walletRepo: IWalletRepository
  ) {}

  async execute(providerId: string, bookingId: string, reason: string) {
    const booking = await this.orderRepository.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    if (booking.providerId.toString() !== providerId.toString()) {
        console.log(" here error gt")
      throw new Error("Unauthorized access to cancel booking");
    }

   
    const eligibleForRefund =true;
    const advancePaid = booking.amount?.advancePaid || 0;
    // const providerAmount =advancePaid?advancePaid/2:0
    const updateFields: any = {
      bookingStatus: "Cancelled",
      updatedAt: new Date(),
      $push: {
        statusHistory: {
          status: "Cancelled",
          at: new Date(),
          reason: reason,
          cancelleBby:providerId
        },
      },
    };

    if (eligibleForRefund) {
      updateFields.paymentStatus = "Refunded";
      updateFields["cancellation.refunded"] = true;
      updateFields["cancellation.refundAmount"] = advancePaid;
      updateFields["cancellation.refundTo"] = "customer";
      updateFields["cancellation.split"] = {
        admin: 0,
        provider: 0,
      };
        await this.walletRepo.creditToWallet({
        userId: booking.customerId,
        amount: advancePaid,
        transactionType: "refund",
      });
    } 

    const updated = await this.orderRepository.updateById(bookingId, updateFields);
    return updated;
  }
}
