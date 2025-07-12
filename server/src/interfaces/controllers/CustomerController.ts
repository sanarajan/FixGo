import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { SubcategoryModel } from "../../infrastructure/database/models/SubcategoryModel";
import { ServiceModel } from "../../infrastructure/database/models/ServiceModel";
import {AdminServicesUsecase} from "../../application/use-cases/customer/services/AdminServicesUsecase"
import {IService} from "./../../domain/models/Iservices"
import {IServiceSubcategories} from "./../../domain/models/IServiceSubcategories"
import {ProviderServicesInLocation} from "../../application/use-cases/customer/services/ProviderServicesInLocation"
import {serviceCategoriesUsecase} from "../../application/use-cases/customer/services/serviceCategoriesUsecase"
import { CustomerAddressManageUsecase } from "../../application/use-cases/customer/address/CustomerAddressManageUsecase";
import { GetCustomerAddressUsecase } from "../../application/use-cases/customer/address/GetCustomerAddressUsecase";
import {ShowCustomerProfileUsecase} from "../../application/use-cases/customer/profile/ShowCustomerProfileUsecase";
import { SaveProfileUsecase } from "../../application/use-cases/provider/providerServices/SaveProfileUsecase";
import { ProviderEditUsecase } from "../../application/use-cases/provider/providerServices/ProviderEditUsecase";
import { ProviderAddressEditUsecase } from "../../application/use-cases/provider/providerServices/ProviderAddressEditUsecase";
import { ProviderResetPasswordUsecase } from "../../application/use-cases/provider/providerServices/ProviderResetPasswordUsecase";

interface CustomError extends Error {
  status?: number;
}
export const adminServices = async (req: Request, res: Response) => {
  try {
     const services = container.resolve(AdminServicesUsecase);
     const serviceslist = await services.execute("service");
     res.status(200).json({ serviceslist });
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};
export const adminSubcategories = async (req: Request, res: Response): Promise<void>  => {
  try {
    const service =req.params.id
     const services = container.resolve(AdminServicesUsecase);
     const serviceslist = await services.execute("subcatgory",service);
     res.status(200).json({ serviceslist });
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const providerSubServices = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const adminId=admin.id
  const { serviceid = null, coordinates = null, mainServiceId = null,providerId=null } = req.body || {};

    const servicesFetch = container.resolve(ProviderServicesInLocation);
    const services = await servicesFetch.execute(mainServiceId,serviceid,coordinates,providerId);

    res.status(200).json({ services });
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const categoriesOfServices = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const adminId=admin.id
   const  serviceId  = req.params.serviceId;
    const servicesFetch = container.resolve(serviceCategoriesUsecase);
    const categories = await servicesFetch.execute(serviceId);

    res.status(200).json({ categories });
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};


export const saveCustomerAddress = async (req: Request, res: Response): Promise<void> => {
  try {   

    const admin = (req as any).user;
    const customerId =admin.id
    const data = { ...req.body };    

    const { location,coordinates   } = data;
    console.log(coordinates?.latitude+" coord")
    const coords = { latitude: coordinates?.lat, longitude: coordinates?.lng };
    const editdata = container.resolve(CustomerAddressManageUsecase);
    const addStaffdata = await editdata.execute(
      customerId,   
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

export const getCustomerAddress = async (req: Request, res: Response): Promise<void> => {
  try {   

    const admin = (req as any).user;
    const customerId =admin.id
   
    const editdata = container.resolve(GetCustomerAddressUsecase);
    const address = await editdata.execute( customerId  );

    res.status(200).json(address);
  } catch (err) {
    const e = err as CustomError;
    console.error("Controller error:", e);
    res.status(e.status || 400).json({ error: e.message });
  }
  
};


export const customerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userAdmin = (req as any).user;
    const adminId = userAdmin.id;
    const profile = container.resolve(ShowCustomerProfileUsecase);
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
export const saveProfileImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const admin = (req as any).user;
    const id = admin.id;
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    const profile = container.resolve<SaveProfileUsecase>(SaveProfileUsecase);
    const result = await profile.execute(id, image);
    res.status(200).json({ result });
  } catch (err) {
    const e = err as CustomError;
    res.status(e.status || 400).json({ error: e.message });
  }
};

export const customerEditPersonal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const admin = (req as any).user;
    const providerid = admin.id;
    const data = { ...req.body };
    const { location, ...userData } = data;
    const coords = { latitude: data.latitude, longitude: data.longitude };
    const editdata = container.resolve(ProviderEditUsecase);
    const addStaffdata = await editdata.execute(
      userData,
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
export const customerEditAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const admin = (req as any).user;
    const customerId = admin.id;
    const data = { ...req.body };
    const { location, ...userData } = data;
    const latitude = data.latitude ? parseFloat(data.latitude) : null;
    const longitude = data.longitude ? parseFloat(data.longitude) : null;

    if (
      latitude === null ||
      isNaN(latitude) ||
      longitude === null ||
      isNaN(longitude)
    ) {
      throw new Error(
        "Latitude and Longitude are required and must be valid numbers."
      );
    }

    const coords = { latitude: latitude, longitude: longitude };
    const editdata = container.resolve(ProviderAddressEditUsecase);
    const addStaffdata = await editdata.execute(
      userData,
      customerId,
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
export const customerPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
            console.log("-reset contr-")

    const { currentPassword,password } = req.body;
    const admin = (req as any).user;

    const id = admin.id;

    if (!password || password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
      return;
    }
            console.log("-reset contr-"+currentPassword)

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