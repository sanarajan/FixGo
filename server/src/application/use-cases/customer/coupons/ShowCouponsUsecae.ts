import { injectable, inject } from "tsyringe";
import { IOfferCouponRepository } from "../../../../domain/repositories/IOfferCouponRepository";
import { ICoupon } from "../../../../domain/models/ICoupon";

@injectable()
export class ShowCouponsUsecae {
  constructor(
    @inject("IOfferCouponRepository")
    private couponRepo: IOfferCouponRepository
  ) {}

  async execute(providerId: string,page: number = 1, limit: number = 3) {
    const offers = await this.couponRepo.showCoupons(
      providerId
     
    );

    if (!offers) return {total:0,coupons:[]};

   return offers
  }
}
