import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ProviderServiceUsecase } from "../../application/use-cases/provider/providerServices/ProviderServiceUsecase";

import { AddProviderServiceUsecase } from "../../application/use-cases/provider/providerServices/AddProviderServiceUsecase";
import { EditProviderServiceUseCase } from "../../application/use-cases/provider/providerServices/EditProviderServiceUseCase";
import { DeleteProviderServiceUsecase } from "../../application/use-cases/provider/providerServices/DeleteProviderServiceUsecase";
import { BlockProviderServiceUsecase } from "../../application/use-cases/provider/providerServices/BlockProviderServiceUsecase";
import { GroupProviderServiceUsecase } from "../../application/use-cases/provider/providerServices/GroupProviderServiceUsecase";
import { AddStaffUsecase } from "../../application/use-cases/provider/providerServices/staffs/AddStaffUsecase";
import { ProviderServicesModel } from "../../infrastructure/database/models/ProviderServicesModel";
import { SubcategoryModel } from "../../infrastructure/database/models/SubcategoryModel";
import { ServiceModel } from "../../infrastructure/database/models/ServiceModel";
import { StaffListUsecase } from "../../application/use-cases/provider/providerServices/staffs/StaffListUsecase";
import { EditStaffUsecase } from "../../application/use-cases/provider/providerServices/staffs/EditStaffUsecase";

import { BlockStaffUsecase } from "../../application/use-cases/provider/providerServices/staffs/BlockStaffUsecase";
import {SaveProfileUsecase} from "../../application/use-cases/provider/providerServices/SaveProfileUsecase";
import {ShowProviderProfileUsecase} from "../../application/use-cases/provider/providerServices/ShowProviderProfileUsecase"

import {ProviderEditUsecase} from "../../application/use-cases/provider/providerServices/ProviderEditUsecase"
import {ProviderAddressEditUsecase} from "../../application/use-cases/provider/providerServices/ProviderAddressEditUsecase"
import bcrypt from "bcrypt";
import {ProviderResetPasswordUsecase} from "../../application/use-cases/provider/providerServices/ProviderResetPasswordUsecase"
interface CustomError extends Error {
  status?: number;
}
export const providerServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
   const userAdmin = (req as any).user;
   const adminId = userAdmin.id
  try {      
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const listServicesUseCase = container.resolve(ProviderServiceUsecase);
    const services = await listServicesUseCase.execute(page, limit,adminId);
    const totalCount = await ProviderServicesModel.countDocuments({createdBy:adminId});
    const totalPages = Math.ceil(totalCount / limit);
    res
      .status(200)
      .json({ services, totalPages, totalCount, currentPage: page });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const alladminServicesList = async (req: Request, res: Response) => {
  try {
    const allservices = await ServiceModel.find({ status: "Active" }).lean();

    res.status(200).json({ allservices });
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};
export const adminSubcategoryList = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.serviceId;
    const subcategrories = await SubcategoryModel.find({
      status: "Active",
      serviceId,
    }).lean();

    res.status(200).json({ subcategrories });
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const providerAddService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userAdmin = (req as any).user;
    const data = req.body;
    if (req.file) {
      // data.image = req.file.path; // Save file path or URL
      data.image = req.file.filename;
    }
    const addSubcategoryUseCase = container.resolve(AddProviderServiceUsecase);
    const newSubcategory = await addSubcategoryUseCase.execute(userAdmin, data);

    res.status(201).json(newSubcategory);
  } catch (err) {
    const error = err as CustomError;
    console.log(error.message);
    res
      .status(error.status || 400)
      .json({ error: error.message || "Something went wrong" });
  }
};

export const providerUpdateService = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const data = req.body;
    if (req.file) {
      data.image = req.file.filename;
    }
    const editUsecase = container.resolve(EditProviderServiceUseCase);
    const edit = await editUsecase.execute(admin, id, data);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const deleteProviderService = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const deleteUsecase = container.resolve(DeleteProviderServiceUsecase);
    const edit = await deleteUsecase.execute(id);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const providerServiceBlockUnblock = async (
  req: Request,
  res: Response
) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const status = req.body.status;
    const blockService = container.resolve(BlockProviderServiceUsecase);
    const edit = await blockService.execute(id, status, admin.id);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const groupedProviderServices = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const adminId=admin.id
    const id = req.params.id;
    const servicesFetch = container.resolve(GroupProviderServiceUsecase);
    const services = await servicesFetch.execute(adminId);
    res.status(200).json({ services });
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};
export const addStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).user;

    const data = { ...req.body };

    if (req.file) {
      data.image = req.file.filename;
    }

    let services: any[] = [];
    if (data.services) {
      try {
        services =
          typeof data.services === "string"
            ? JSON.parse(data.services)
            : data.services;
      } catch (error) {
        console.error("Error parsing services:", error);
        res.status(400).json({ error: "Invalid services format" });
      }
    }

    const { location, services: _s, ...userData } = data;
    // console.log(userData.longitude+"--location cords-"+userData.latitude)
    const coords = { latitude: data.latitude, longitude: data.longitude };
    const dataUsecase = container.resolve(AddStaffUsecase);
    const addStaffdata = await dataUsecase.execute(
      userData,
      services,
      admin.id,
      location,
      coords
    );

    res.status(200).json(addStaffdata);
  } catch (err) {
    const e = err as CustomError;
    console.error("Controller error:", e);
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const staffList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userAdmin=(req as any).user
     const adminId = userAdmin.id
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const staffListUsecase = container.resolve(StaffListUsecase);
    const { data, totalCount } = await staffListUsecase.execute(page, limit,adminId);
    const totalPages = Math.ceil(totalCount / limit);

    res
      .status(200)
      .json({ staffs: data, totalPages, totalCount, currentPage: page });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const editStaff = async (req: Request, res: Response): Promise<void> => {
  try {   

    const admin = (req as any).user;
    const providerid =admin.id
    const id = req.params.id;
    const data = { ...req.body };

    if (req.file) {
      data.image = req.file.filename;
    }

    let services: any[] = [];
    if (data.services) {
      try {
        services =
          typeof data.services === "string"
            ? JSON.parse(data.services)
            : data.services;
      } catch (error) {
        console.error("Error parsing services:", error);
        res.status(400).json({ error: "Invalid services format" });
      }
    }
    //old services
    let oldServices: any[] = [];
if (data.oldServices) {
  try {
    oldServices = typeof data.oldServices === "string"
      ? JSON.parse(data.oldServices)
      : data.oldServices;
  } catch (error) {
    console.error("Error parsing oldServices:", error);
    res.status(400).json({ error: "Invalid oldServices format" });
    return;
  }
}

    const { location, services: _s, ...userData } = data;
    // console.log(userData.longitude+"--location cords-"+userData.latitude)
    const coords = { latitude: data.latitude, longitude: data.longitude };
    const dataUsecase = container.resolve(EditStaffUsecase);
    const addStaffdata = await dataUsecase.execute(
      userData,
      services,
      admin.id,
      location,
      coords,
      id,
      oldServices
    );

    res.status(200).json(addStaffdata);
  } catch (err) {
    const e = err as CustomError;
    console.error("Controller error:", e);
    res.status(e.status || 400).json({ error: e.message });
  }
};


export const staffBlockUnblock = async (
  req: Request,
  res: Response
) => {
  try {
    const admin = (req as any).user;
    const id = req.params.id;
    const status = req.body.status;
    const blockStaff = container.resolve(BlockStaffUsecase);
    const edit = await blockStaff.execute(id, status, admin.id);
    res.status(200).json(edit);
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const saveProfileImage = async (
  req: Request,
  res: Response
) :Promise<void> => {
  try {
    const admin = (req as any).user;
    const id = admin.id;
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }
    console.log("ETHUNNUND"+image)

    const profile = container.resolve<SaveProfileUsecase>(SaveProfileUsecase);
    const result = await profile.execute(id, image);
    console.log(result+"in contr image")
 res.status(200).json({ result });
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const providerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userAdmin=(req as any).user
     const adminId = userAdmin.id
  
    const profile = container.resolve(ShowProviderProfileUsecase);
    const user = await profile.execute(adminId);

   
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user: user });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
  
};

export const providerEditPersonal = async (req: Request, res: Response): Promise<void> => {
  try {   

    const admin = (req as any).user;
    const providerid =admin.id
    const data = { ...req.body };

    

    const { location,  ...userData } = data;
    const coords = { latitude: data.latitude, longitude: data.longitude };
    const editdata = container.resolve(ProviderEditUsecase);
    const addStaffdata = await editdata.execute(
      userData,
      admin.id,
      location,
      coords,
    );

    res.status(200).json(addStaffdata);
  } catch (err) {
    const e = err as CustomError;
    console.error("Controller error:", e);
    res.status(e.status || 400).json({ error: e.message });
  }
  
};

export const providerEditAddress = async (req: Request, res: Response): Promise<void> => {
  try {   

    const admin = (req as any).user;
    const providerid =admin.id
    const data = { ...req.body };    
    const { location,  ...userData } = data;
    const coords = { latitude: data?.latitude, longitude: data?.longitude };
    const editdata = container.resolve(ProviderAddressEditUsecase);
    const addStaffdata = await editdata.execute(
      userData,
      providerid,
      location,
      coords,
    );

    res.status(200).json(addStaffdata);
  } catch (err) {
    const e = err as CustomError;
    console.error("Controller error:", e);
    res.status(e.status || 400).json({ error: e.message });
  }
  
};


export const providerPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
      const { password } =req.body ; 
       const admin = (req as any).user;
           console.log(" reached"+admin)

    const id =admin.id

    if (!password || password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters long" });
      return;
    }
     console.log(id+"  id und")

    const resetPasswordUseCase = container.resolve(ProviderResetPasswordUsecase);
    const success = await resetPasswordUseCase.execute(password,id);

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