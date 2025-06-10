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
interface CustomError extends Error {
  status?: number;
}
export const adminServices = async (req: Request, res: Response) => {
  try {console.log("reached for fetchinga admin services")
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

   console.log(serviceid,mainServiceId,coordinates+"main serviceid")
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