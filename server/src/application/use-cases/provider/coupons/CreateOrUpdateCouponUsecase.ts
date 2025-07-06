// FILE: src/application/usecases/provider/coupon/CreateOrUpdateCouponUsecase.ts

import { inject, injectable } from "tsyringe";
import { IOfferCouponRepository } from "../../../../domain/repositories/IOfferCouponRepository";
import { ICoupon } from "../../../../domain/models/ICoupon";

@injectable()
export class CreateOrUpdateCouponUsecase {
  constructor(
    @inject("IOfferCouponRepository")
    private couponRepository: IOfferCouponRepository
  ) {}

  async execute(data: Partial<ICoupon>, isEdit = false): Promise<ICoupon> {
    const {
      couponName,
      startDate,
      endDate,
      discountType,
      discountPercentage,
      discountValue,
      providerId,
      createdBy,
      updatedBy,
      minPurchase,
      userUsageLimit,
      couponImage,
    } = data;

    const _id = (data as any)._id;

    if (!couponName || !startDate || !endDate || !providerId || (!isEdit && !createdBy)) {
      throw new Error("Required fields are missing.");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      throw new Error("Start date must be before end date.");
    }

    // ✅ Unique coupon name check
    const existingCoupon = await this.couponRepository.findByNameAndProvider(
      couponName.trim(),
      providerId.toString()
    );

    if (
      existingCoupon &&
      (!isEdit || existingCoupon._id?.toString() !== _id?.toString())
    ) {
      throw new Error("Coupon with this name already exists.");
    }

    const payload: Partial<ICoupon> = {
      couponName: couponName.trim(),
      startDate: start,
      endDate: end,
      discountType,
      discountPercentage: discountType === "percentage" ? discountPercentage ?? 0 : 0,
      discountValue: discountType === "price" ? discountValue ?? 0 : 0,
      providerId,
      createdBy,
      updatedBy,
      minPurchase,
      userUsageLimit,
      couponImage,
    };

    if (isEdit && _id) {
      const updated = await this.couponRepository.updateCoupon(_id.toString(), payload);
      if (!updated) {
        throw new Error("Coupon not found for update.");
      }
      return updated;
    } else {
      return await this.couponRepository.createCoupon(payload);
    }
  }
}
