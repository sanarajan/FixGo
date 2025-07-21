import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { ProviderOrderlistUsecase } from "../../application/use-cases/provider/orders/ProviderOrderlistUsecase";
import { container } from "tsyringe";
import { OrdersModel } from "../../infrastructure/database/models/OrdersModel";
import { IOrder } from "../../domain/models/IOrder";
import {CustomerOrderlistUsecase} from "../../application/use-cases/customer/orders/CustomerOrderlistUsecase"
import {UpdateBookingStatusUsecase} from "../../application/use-cases/provider/updateBookingStatus/UpdateBookingStatusUsecase"
import {BookingOtpVerifyUsecase} from "../../application/use-cases/provider/updateBookingStatus/BookingOtpVerifyUsecase"
import {EndServiceWithInvoiceUsecase} from "../../application/use-cases/provider/updateBookingStatus/EndServiceWithInvoiceUsecase"
import {BookingDetailsUsecase} from "../../application/use-cases/customer/orders/BookingDetailsUsecase"
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
export const customerBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
   
    const admin = (req as any).user;
    const customerId = admin.id; 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const providerOrders = container.resolve(CustomerOrderlistUsecase);
   
    const { orders, totalCount } = await providerOrders.execute(  customerId,
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


export const updateBookingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
   
    const customer = (req as any).user;
    const providerId = customer.id; 
  
   const  {bookingStatus, bookingId,email} = req.body;
    const updated = container.resolve(UpdateBookingStatusUsecase);
   
    const updateStatus = await updated.execute(providerId,bookingId, bookingStatus,email);

    res
      .status(200)
      .json({ updateStatus: updateStatus });
  } catch (error) {
    console.error("Order controller has Error:", error);
    res.status(500).send("Internal Server Error");
  }
};


export const bookingOtpVerify = async (req: Request, res: Response): Promise<void> => {
  try {
    
    let { email, otp,bookingId } = req.body;
 const admin = (req as any).user;
    const providerId = admin.id; 
    const otpService = container.resolve(BookingOtpVerifyUsecase);
    const verified = await   otpService.execute(bookingId,email, otp,providerId);

    if (!verified) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }    

    res.status(200).json({
      message: "OTP validated successfully and provider verified",
      isValid: true,
    });
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "OTP validation failed",
    });
  }
};
export const endServiceWithInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(" reaching")
   const payload = req.body;
    console.log(payload+"payload")
 const admin = (req as any).user;
    const providerId = admin.id; 
    const endservice = container.resolve(EndServiceWithInvoiceUsecase);
    const end = await   endservice.execute(providerId,payload);

    if (!end) {
      res.status(400).json({ message: "Cannot send invoice" });
      return;
    }    

    res.status(200).json({
      message: "Invoice send successfully",
      isValid: true,
    });
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "Invoice send failed",
    });
  }
};

export const bookingDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
   
    const admin = (req as any).user;
    const customerId = admin.id; 
    const bookingId  =req.params.id
    const providerOrders = container.resolve(BookingDetailsUsecase);
   
    const { order } = await providerOrders.execute(  customerId,bookingId
    );

     res.status(200).json({ order }); 
  } catch (error) {
    console.error("PaymentController Error:", error);
    res.status(500).send("Internal Server Error");
  }
};



