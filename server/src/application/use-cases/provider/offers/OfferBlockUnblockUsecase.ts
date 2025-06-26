import { injectable, inject } from "tsyringe";
import { IOfferCouponRepository } from "../../../../domain/repositories/IOfferCouponRepository";
@injectable()
@injectable()
export class OfferBlockUnblockUsecase {
  constructor(
    @inject("IOfferCouponRepository") private repo: IOfferCouponRepository,
  ) {}

  async execute(id: string,status:string,admin:string): Promise<boolean> {
    const current = await this.repo.offersFindById(id);
    if (!current) {
      const err = new Error("Offer not exist") as any;
      err.status = 404;
      throw err;
    }
       const updated = await this.repo.changeOfferStatus(id,status,admin);
    return updated?true:false;
  }
}
