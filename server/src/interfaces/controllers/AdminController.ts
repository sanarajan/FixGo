// src/interfaces/controllers/CustomerController.ts
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ListCustomers } from "../../application/use-cases/ListCustomers";
import { ListProviders } from "../../application/use-cases/ListProviders";
import { ViewCustomer } from "../../application/use-cases/ViewCustomer";
import { ViewProvider } from "../../application/use-cases/ViewProvider";
import { UserRepositoryImpl } from "../../infrastructure/database/repositories/UserRepositoryImpl";
import { BlockUnblockProviderUseCase } from "../../application/use-cases/admin/lists/BlockUnblockProviderUseCase";
import { UserModel } from "../../infrastructure/database/models/UserModel";

interface CustomError extends Error {
  status?: number;
}
export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const listCustomers = container.resolve(ListCustomers);
    const customers = await listCustomers.execute();
    const totalCount = await UserModel.countDocuments({ role: "customer" });

    const totalPages = Math.ceil(totalCount / limit);
    res
      .status(200)
      .json({ customers, totalPages, totalCount, currentPage: page });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getAllProviders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const listProviders = container.resolve(ListProviders);
    const customers = await listProviders.execute(page, limit);
    const totalCount = await UserModel.countDocuments({
      role: { $in: ["provider", "worker"] },
    });

    const totalPages = Math.ceil(totalCount / limit);
    res
      .status(200)
      .json({ customers, totalPages, totalCount, currentPage: page });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};
export const customerView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const userRepository = new UserRepositoryImpl();
    const viewCustomerUseCase = new ViewCustomer(userRepository);
    const customer = await viewCustomerUseCase.execute(id);
    res.status(200).json(customer);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};
export const providerView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepository = new UserRepositoryImpl();
    const viewCustomerUseCase = new ViewProvider(userRepository);
    const customer = await viewCustomerUseCase.execute(id);
    res.status(200).json(customer);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const blockUnblockProvider = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const status = req.body.status;
    const blockService = container.resolve(BlockUnblockProviderUseCase);
    const edit = await blockService.execute(id, status, admin.id);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const adminLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
     const admin = (req as any).user;
    const customerId =admin.id
    const role =admin.role
    console.log("rle from admin logout",role)
 res.cookie(`${role}_refreshToken`, "", {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  expires: new Date(0), // force expire cookie
});
    res.status(200).json({ message: "Logged out",role });
  } catch (err) {
    const error = err as CustomError;
    res
      .status(error.status || 400)
      .json({ error: error.message || "verification failed" });
  }
};

