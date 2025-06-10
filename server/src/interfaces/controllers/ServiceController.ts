import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ListServicesUseCase } from "../../application/use-cases/admin/services/ListServicesUseCase";
import { AddServicesuseCase } from "../../application/use-cases/admin/services/AddServiceUseCase";
import { EditServiceUseCase } from "../../application/use-cases/admin/services/EditServiceUsecase";
import { DeleteServiceUsecase } from "../../application/use-cases/admin/services/DeleteServiceUsecase";
import { BlockUnblockServiceUsecase } from "../../application/use-cases/admin/services/BlockUnblockServiceUsecase";
import { addServiceSubcategoryuseCase } from "../../application/use-cases/admin/subcategory/addServiceSubcategoryuseCase";
import { ServicesSubcategoriesUseCase } from "../../application/use-cases/admin/subcategory/ServicesSubcategoriesUseCase";
import { EditSubcategoryUseCase } from "../../application/use-cases/admin/subcategory/EditSubcategoryUseCase";

import { BlockUnblockSubcategoryUsecase } from "../../application/use-cases/admin/subcategory/BlockUnblockSUbcategoryUsecase";

import { DeleteSubcategoryUsecase } from "../../application/use-cases/admin/subcategory/DeleteSubcategoryUsecase";

import {
  ServiceModel,
  IService,
} from "../../infrastructure/database/models/ServiceModel";

import { SubcategoryModel } from "../../infrastructure/database/models/SubcategoryModel";
// import { exit } from "process";

interface CustomError extends Error {
  status?: number;
}
export const servicesList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const listServicesUseCase = container.resolve(ListServicesUseCase);
    const services = await listServicesUseCase.execute(page, limit);
    const totalCount = await ServiceModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    res
      .status(200)
      .json({ services, totalPages, totalCount, currentPage: page });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const addService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userAdmin = (req as any).user;
    const data = req.body;
    const addServicesuseCase = container.resolve(AddServicesuseCase);
    const services = await addServicesuseCase.execute(userAdmin, data);
    res.status(201).json(services);
  } catch (err) {
    const error = err as CustomError;
    res
      .status(error.status || 400)
      .json({ error: error.message || "Something went wrong" });
  }
};
export const editService = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const data = req.body;
    const editUsecase = container.resolve(EditServiceUseCase);
    const edit = await editUsecase.execute(admin, id, data);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};
export const deleteService = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const deleteUsecase = container.resolve(DeleteServiceUsecase);
    const edit = await deleteUsecase.execute(id);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const blockUnblock = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const status = req.body.status;
    const blockService = container.resolve(BlockUnblockServiceUsecase);
    const edit = await blockService.execute(id, status, admin.id);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const servicesSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const listServicesUseCase = container.resolve(ServicesSubcategoriesUseCase);
    const services = await listServicesUseCase.execute(page, limit);
    const totalCount = await SubcategoryModel.countDocuments();
    console.log(totalCount + " tot count");
    const totalPages = Math.ceil(totalCount / limit);
    console.log(totalPages + " tot count");

    res
      .status(200)
      .json({ services, totalPages, totalCount, currentPage: page });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const addServiceSubcategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userAdmin = (req as any).user;
    const data = req.body;
    const addSubcategoryUseCase = container.resolve(
      addServiceSubcategoryuseCase
    );
    const newSubcategory = await addSubcategoryUseCase.execute(userAdmin, data);

    res.status(201).json(newSubcategory);
  } catch (err) {
    const error = err as CustomError;
    res
      .status(error.status || 400)
      .json({ error: error.message || "Something went wrong" });
  }
};

export const editServiceSubcategory = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const data = req.body;
    console.log(data + "  data");
    const editUsecase = container.resolve(EditSubcategoryUseCase);
    const edit = await editUsecase.execute(admin, id, data);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const subcategoryBlock = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const status = req.body.status;
    const blocksubcate = container.resolve(BlockUnblockSubcategoryUsecase);
    const edit = await blocksubcate.execute(id, status, admin.id);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};


export const deleteSubcategory = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const deleteUsecase = container.resolve(DeleteSubcategoryUsecase);
    const edit = await deleteUsecase.execute(id);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};
