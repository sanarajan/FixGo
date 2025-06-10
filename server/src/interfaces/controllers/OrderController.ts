import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { ProviderOrderlistUsecase } from "../../application/use-cases/provider/orders/ProviderOrderlistUsecase";
import { container } from "tsyringe";
import { OrdersModel } from "../../infrastructure/database/models/OrdersModel";
import { IOrder } from "../../domain/models/IOrder";

//this only for local usage. for public domain we use STRIPE_SECRET_KEY instead of this

export const bookingList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
   
    const admin = (req as any).user;
    const providerId = admin.id; 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const providerOrders = container.resolve(ProviderOrderlistUsecase);
   
    const { orders, totalCount } = await providerOrders.execute(  providerId,
     page,
     limit);
    const totalPages = Math.ceil(totalCount / limit);

    res
      .status(200)
      .json({ orders: orders, totalPages, totalCount, currentPage: page });
  } catch (error) {
    console.error("PaymentController Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

