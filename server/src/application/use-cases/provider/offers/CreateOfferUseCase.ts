import { inject, injectable } from "tsyringe";
import { IOfferCouponRepository } from "../../../../domain/repositories/IOfferCouponRepository";
import { IOffer } from "../../../../domain/models/IOffer";
import { OfferModel } from "../../../../infrastructure/database/models/OfferModel";

@injectable()
export class CreateOfferUseCase {
  constructor(
    @inject("IOfferCouponRepository")
    private offerRepository: IOfferCouponRepository
  ) {}


  async execute(data: Partial<IOffer>): Promise<IOffer> {
    const {
      offerFor,
      serviceId,
      subcategoryId,
      startDate,
      endDate,
      offerName,
      _id, // present only during edit
    } = data;

    const start = new Date(startDate!);
    const end = new Date(endDate!);

    // 1. Check duplicate offer name (exclude self if editing)
    const existingOfferWithSameName = await OfferModel.findOne({
      offerName: offerName?.trim(),
      ...(!!_id && { _id: { $ne: _id } }),
    }).lean();

    if (existingOfferWithSameName) {
      throw new Error("An offer with this name already exists.");
    }

    // 2. Overlap logic - exclude current offer if editing
    const overlapFilter: any = {
      offerFor,
      serviceId,
      status: { $ne: "Inactive" },
      startDate: { $lte: end },
      endDate: { $gte: start },
    };

    if (_id) {
      overlapFilter._id = { $ne: _id };
    }

    if (offerFor === "service") {
      const existing = await OfferModel.findOne(overlapFilter).lean();
      if (existing) {
        throw new Error("Cannot create/edit offer: this service already has an active offer in the selected date range.");
      }
    } else if (offerFor === "subcategory") {
      const existing = await OfferModel.findOne({
        $or: [
          {
            offerFor: "service",
            serviceId,
            status: { $ne: "Inactive" },
            startDate: { $lte: end },
            endDate: { $gte: start },
            ...(!!_id && { _id: { $ne: _id } }),
          },
          {
            offerFor: "subcategory",
            serviceId,
            subcategoryId,
            status: { $ne: "Inactive" },
            startDate: { $lte: end },
            endDate: { $gte: start },
            ...(!!_id && { _id: { $ne: _id } }),
          },
        ],
      }).lean();

      if (existing) {
        if (existing.offerFor === "service") {
          throw new Error("Cannot create/edit subcategory offer: parent service already has an active offer.");
        } else {
          throw new Error("Cannot create/edit offer: this subcategory already has an active offer in the date range.");
        }
      }
    } else {
      throw new Error("Invalid offerFor value. Must be 'service' or 'subcategory'.");
    }

    if (_id) {
      // Edit mode
      return await this.offerRepository.updateOffer(_id, data);
    } else {
      // Create mode
      return await this.offerRepository.createOffer(data);
    }
  }
}
