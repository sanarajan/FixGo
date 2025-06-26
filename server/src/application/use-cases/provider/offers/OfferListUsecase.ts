import { injectable, inject } from "tsyringe";
import { IOfferCouponRepository } from "../../../../domain/repositories/IOfferCouponRepository";
@injectable()
export class OfferListUsecase {
  constructor(
    @inject("IOfferCouponRepository")
    private offerRepo: IOfferCouponRepository
  ) {}

  async execute(providerId: string,page: number = 1, limit: number = 3) {
    const offers = await this.offerRepo.providerOfferslist(
      providerId,
      page,
      limit
    );

    if (!offers) return { services: [] };

   return offers
  }
}
