import { injectable, inject } from "tsyringe";
import { IOfferCouponRepository } from "../../../../domain/repositories/IOfferCouponRepository";
import { ICoupon } from "../../../../domain/models/ICoupon";

@injectable()
export class CouponListUsecase {
  constructor(
    @inject("IOfferCouponRepository")
    private offerRepo: IOfferCouponRepository
  ) {}

  async execute(providerId: string,page: number = 1, limit: number = 3) {
    const offers = await this.offerRepo.providerCouponList(
      providerId,
      page,
      limit
    );

    if (!offers) return { services: [] };

   return offers
  }
}
