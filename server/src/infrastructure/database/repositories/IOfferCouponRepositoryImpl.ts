import { IOfferCouponRepository } from "../../../domain/repositories/IOfferCouponRepository";
import { OfferModel } from "../models/OfferModel";
import { IOffer } from "../../../domain/models/IOffer";
import { ProviderServicesModel } from "../models/ProviderServicesModel";

export class IOfferCouponRepositoryImpl implements IOfferCouponRepository {
  async createOffer(data: Partial<IOffer>): Promise<IOffer> {
    const offer = new OfferModel(data);
    return await offer.save();
  }
  async providerOfferslist(providerId:string,page: number = 1, limit: number = 3): Promise<IOffer[]>{
    const offers = await OfferModel.find({ createdBy: providerId })
    .populate({ path: "serviceId", select: "serviceName _id" })
    .populate({ path: "subcategoryId", select: "subcategory _id" })
    .populate({ path: "providerServiceId", select: "subcategoryName totalAmount amountPerHour averageTimeInHours image description features" })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return offers;
  }
  
  async offersFindById(id: string): Promise<IOffer | null> {
    if (!id) return null;
    return OfferModel.findById(id).lean();
  }
 async changeOfferStatus(id: string, status: string, admin: string): Promise<boolean> {
  const offer = await OfferModel.findById(id).lean();

  if (!offer) {
    throw new Error("Offer not found");
  }

  const { providerServiceId, startDate, endDate } = offer;

  // 1. Check if the ProviderService is Active
  const providerService = await ProviderServicesModel.findOne({
    _id: providerServiceId,
    status: "Active",
  }).lean();

  if (!providerService) {
    throw new Error("Cannot activate offer: related ProviderService is not active");
  }

  // 2. Check for overlapping active offers (excluding current offer)
  if (status === "Active") {
    const overlappingOffers = await OfferModel.findOne({
      _id: { $ne: id }, // exclude this offer
      providerServiceId,
      status: "Active",
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    }).lean();

    if (overlappingOffers) {
      throw new Error("Cannot activate offer: another active offer exists in the same date range");
    }
  }

  // 3. All good, update offer status
  const updated = await OfferModel.findByIdAndUpdate(
    id,
    {
      $set: {
        status,
        updatedBy: admin,
      },
    },
    { new: true, lean: true }
  );

  if (!updated) {
    throw new Error("Failed to update offer");
  }

  return true;
}

    async updateOffer(id: string, data: Partial<IOffer>): Promise<IOffer> {
      console.log(id+" id")
  const updated = await OfferModel.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error("Offer not found for update");
  return updated;
}
    
}

