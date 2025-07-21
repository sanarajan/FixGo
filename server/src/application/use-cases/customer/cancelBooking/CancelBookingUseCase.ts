import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../../../domain/repositories/customer/IOrderRepository";
import { IWalletRepository } from "../../../../domain/repositories/IWalletRepository"; // update path as needed

@injectable()
export class CancelBookingUseCase {
  constructor(
    @inject("IOrderRepository") private orderRepository: IOrderRepository,
      @inject("IWalletRepository") private walletRepo: IWalletRepository
  ) {}

  async execute(customerId: string, bookingId: string, reason: string) {
    const booking = await this.orderRepository.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    if (booking.customerId.toString() !== customerId.toString()) {
      throw new Error("Unauthorized access to cancel booking");
    }

    const serviceTime = new Date(booking.slot.date);
    const currentTime = new Date();
    const diffInMs = serviceTime.getTime() - currentTime.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);

    const eligibleForRefund = diffInMinutes > 15;
    const advancePaid = booking.amount?.advancePaid || 0;
    const providerAmount =advancePaid?advancePaid/2:0
    const updateFields: any = {
      bookingStatus: "Cancelled",
      updatedAt: new Date(),
      $push: {
        statusHistory: {
          status: "Cancelled",
          at: new Date(),
          reason: reason,
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
    } else {
      // Not eligible for refund, split advancePaid between admin & provider
      const splitAmount = advancePaid / 2;
      updateFields["cancellation.refunded"] = false;
      updateFields["cancellation.refundAmount"] = 0;
      updateFields["cancellation.refundTo"] = "provider";
      updateFields["cancellation.split"] = {
        admin: Math.floor(splitAmount),
        provider: Math.ceil(splitAmount), // to ensure full value is preserved
      };
      // Do not update paymentStatus
      await this.walletRepo.creditToWallet({
        userId: booking.providerId,
        amount: providerAmount,
        transactionType: "refund",
      });
    }

    const updated = await this.orderRepository.updateById(bookingId, updateFields);
    return updated;
  }
}
