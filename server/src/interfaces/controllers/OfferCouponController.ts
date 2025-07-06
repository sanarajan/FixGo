import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateOfferUseCase } from "../../application/use-cases/provider/offers/CreateOfferUseCase";
import { OfferModel } from "../../infrastructure/database/models/OfferModel";
import {OfferListUsecase} from "../../application/use-cases/provider/offers/OfferListUsecase";
import {OfferBlockUnblockUsecase} from "../../application/use-cases/provider/offers/OfferBlockUnblockUsecase";
import {CreateOrUpdateCouponUsecase} from "../../application/use-cases/provider/coupons/CreateOrUpdateCouponUsecase";
import {CouponListUsecase} from "../../application/use-cases/provider/coupons/CouponListUsecase";
import {ShowCouponsUsecae} from "../../application/use-cases/customer/coupons/ShowCouponsUsecae"
export const addOffer = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const createOfferUseCase = container.resolve(CreateOfferUseCase);
    const offer = await createOfferUseCase.execute({
      ...req.body,
      createdBy: userId,
    });

    res.status(201).json({ message: "Offer created", offer });
  } catch (error: any) {
    console.error("Create offer error:", error.message);
    res.status(500).json({ error: error.message || "Server error" });
  }
};
interface CustomError extends Error {
  status?: number;
}
export const offerList = async (
  req: Request,
  res: Response,
  
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
   const providerId = (req as any).user?.id;
    const offersUsecase = container.resolve(OfferListUsecase);
    const offers = await offersUsecase.execute(providerId,page, limit);
    const totalCount = await OfferModel.countDocuments({createdBy:providerId});
    const totalPages = Math.ceil(totalCount / limit);
    res
      .status(200)
      .json({ offers, totalPages, totalCount, currentPage: page });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const offerBlockUnblock = async (
  req: Request,
  res: Response
) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const status = req.body.status;
    const blockOffer = container.resolve(OfferBlockUnblockUsecase);
    const edit = await blockOffer.execute(id, status, admin.id);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const editOffer = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const createOfferUseCase = container.resolve(CreateOfferUseCase);
    const offer = await createOfferUseCase.execute({
      ...req.body,
      createdBy: userId,
    });

    res.status(201).json({ message: "Offer Updated", offer });
  } catch (error: any) {
    console.error("Create offer error:", error.message);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const addCoupon = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const usecase = container.resolve(CreateOrUpdateCouponUsecase);
let image =""
    if (req.file) {
      // data.image = req.file.path; // Save file path or URL
    image = req.file.filename;
    }
    const imagePath = image ? image:null;

    const payload = {
      ...req.body,
      providerId: user.id,
      createdBy: user.id,
      couponImage: imagePath, // ✅ SINGLE image path string now
      minPurchase: Number(req.body.minPurchase),
      discountPercentage: Number(req.body.discountPercentage),
      discountValue: Number(req.body.discountValue),
      userUsageLimit: Number(req.body.userUsageLimit),
    };
console.log(JSON.stringify(payload,null,2)+" payload coupon")
    const created = await usecase.execute(payload);
    res.status(201).json(created);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message || "Failed to add coupon" });
  }
};

export const editCoupon = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const usecase = container.resolve(CreateOrUpdateCouponUsecase);
 let image: string | null = null;

    if (req.file) {
      image = req.file.filename;
    } else if (req.body.couponImage) {
      image = req.body.couponImage;
    }

    const payload = {
      ...req.body,
      _id: req.params.id,
      providerId: user.id,
      updatedBy: user.id,
      couponImage: image,
      minPurchase: Number(req.body.minPurchase),
      discountPercentage: Number(req.body.discountPercentage),
      discountValue: Number(req.body.discountValue),
      userUsageLimit: Number(req.body.userUsageLimit),
    };

    const updated = await usecase.execute(payload, true); // true => update
    res.status(200).json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message || "Failed to update coupon" });
  }
};


export const couponList = async (
  req: Request,
  res: Response,
  
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
   const providerId = (req as any).user?.id;
    const couponUsecase = container.resolve(CouponListUsecase);
    const coupons = await couponUsecase.execute(providerId,page, limit);
    const totalCount = await OfferModel.countDocuments({createdBy:providerId});
    const totalPages = Math.ceil(totalCount / limit);
    res
      .status(200)
      .json({ coupons, totalPages, totalCount, currentPage: page });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};
export const showCoupons = async (
  req: Request,
  res: Response,
  
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
   const providerId = req.params.providerId;
    const couponUsecase = container.resolve(ShowCouponsUsecae);
       const { total, coupons } = await couponUsecase.execute(providerId);

    const couponCount = total;
    res
      .status(200)
      .json({ coupons,  couponCount});
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};
