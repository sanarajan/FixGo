import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import {NotificationUsecase} from "../../application/use-cases/provider/notifications/NotificationUsecase"
interface CustomError extends Error {
  status?: number;
}
export const notifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userAdmin = (req as any).user;
  const adminId = userAdmin.id;
  try {
    // const page = parseInt(req.query.page as string) || 1;
    // const limit = parseInt(req.query.limit as string) || 10;
    const notifyUsecase = container.resolve(NotificationUsecase);
    const {data,totalCount} = await notifyUsecase.execute(adminId);
  
    res
      .status(200)
      .json({ notifications:data,totalCount,adminId });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};