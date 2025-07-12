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
import  {  Document, Types } from 'mongoose';
import {ProvidersStaffsUsecase} from "../../application/use-cases/admin/staffs/ProvidersStaffsUsecase";
import { OtpService } from "../../application/services/OtpService";
import { AuthService } from "../../application/services/AuthService";
import { UserRepository } from "../../domain/repositories/UserRepository";
import {RejectStaffUseCase} from "../../application/use-cases/admin/staffs/RejectStaffUseCase";
import { ProviderResetPasswordUsecase } from "../../application/use-cases/provider/providerServices/ProviderResetPasswordUsecase";

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
    const providers = await listProviders.execute(page, limit);

    const totalCount = await UserModel.countDocuments({
      role: { $in: ["provider", "worker"] },
      type:{$ne:"staff"}
    });

 const providerIds = providers
  .map((p) => p._id)
  .filter((id): id is string => !!id)
  .map((id) => new Types.ObjectId(id));

    const staffsGrouped = await UserModel.aggregate([
      { $match: { type: "staff", providerId: { $in: providerIds } } },
      { $group: { _id: "$providerId", count: { $sum: 1 } } },
    ]);

    const staffMap = Object.fromEntries(
      staffsGrouped.map((s) => [s._id.toString(), s.count])
    );

    const providersWithStaffInfo = providers.map((provider) => ({
      ...provider,
      isStaffExist: provider._id
        ? !!staffMap[provider._id.toString()]
        : false,
    }));

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      customers: providersWithStaffInfo,
      totalPages,
      totalCount,
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const providersStaffs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
     const providerId = req.query.providerId as string;
    const staffs = container.resolve(ProvidersStaffsUsecase);
    const customers = await staffs.execute(page,limit,providerId);
    const totalCount = await UserModel.countDocuments({ type: "staff", providerId:providerId });

    const totalPages = Math.ceil(totalCount / limit);
    res
      .status(200)
      .json({ customers:customers.data, totalPages, totalCount, currentPage: page });
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

export const validateStaffVerifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    let { otpEmail, userOtp } = req.body;
    const email = otpEmail;

    const otpService = container.resolve<OtpService>("OtpService");
    const isValid = await otpService.validateOtp(email, userOtp);

    if (!isValid) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    const userRepository = container.resolve<UserRepository>("UserRepository");
    let user = await userRepository.findByEmail(email);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await UserModel.findByIdAndUpdate(user._id, {
      verified: true,
      rejectionReason: null,
      needsReverification: false,
      lastReviewedByAdmin: new Date(),
      adminSeen: true,
      providerSeen: false,
    });

    res.status(200).json({
      message: "OTP validated successfully and user verified",
      isValid: true,
    });
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "OTP validation failed",
    });
  }
};



export const rejectStaff = async (req: Request, res: Response): Promise<void> => {
  try {
     const admin = (req as any).user;
    const adminId =admin.id
    const { staffId, reason,data } = req.body;
    const rejectStaffUseCase = container.resolve(RejectStaffUseCase);
    const result = await rejectStaffUseCase.execute(staffId, reason,data,adminId);

    res.status(200).json({ message: "Staff rejected successfully", result });
  } catch (err) {
    const error = err as Error;
       console.log("❌ Controller error", error.message); // ✅ log error too
    res.status(400).json({ error: error.message || "Rejection failed" });
  }
};

export const adminPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword,password } = req.body;
    const admin = (req as any).user;

    const id = admin.id;

    if (!password || password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
      return;
    }

    const resetPasswordUseCase = container.resolve(
      ProviderResetPasswordUsecase
    );
    const success = await resetPasswordUseCase.execute(currentPassword,password, id);

    if (success) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(500).json({ message: "Could not update password" });
    }
  } catch (err) {
    const error = err as Error;
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};
