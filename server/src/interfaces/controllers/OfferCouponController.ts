import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateOfferUseCase } from "../../application/use-cases/provider/offers/CreateOfferUseCase";
import { OfferModel } from "../../infrastructure/database/models/OfferModel";
import {OfferListUsecase} from "../../application/use-cases/provider/offers/OfferListUsecase";
import {OfferBlockUnblockUsecase} from "../../application/use-cases/provider/offers/OfferBlockUnblockUsecase"
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
