import { IOffer } from "../models/IOffer";
import { Types } from "mongoose";
import { ICoupon } from "../models/ICoupon";

export interface IOfferCouponRepository {
  createOffer(data: Partial<IOffer>): Promise<IOffer>;
  providerOfferslist(providerId:string, page:number,limit:number): Promise<IOffer[]>
  
    offersFindById(id: string): Promise<IOffer | null>;  
    changeOfferStatus(id: string,status:string,admin:string): Promise<boolean | null>;
     updateOffer(id: string|Types.ObjectId, data: Partial<IOffer>): Promise<IOffer>
findByNameAndProvider(name: string, providerId: string): Promise<ICoupon | null>;
       createCoupon(data: Partial<ICoupon>): Promise<ICoupon>;
  updateCoupon(id: string, data: Partial<ICoupon>): Promise<ICoupon|null>;
  providerCouponList(providerId:string, page:number,limit:number): Promise<ICoupon[]>
showCoupons(providerId:string): Promise<{total: number,coupons:ICoupon[]}>
}
