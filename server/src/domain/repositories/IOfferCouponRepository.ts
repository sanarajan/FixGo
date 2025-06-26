import { IOffer } from "../models/IOffer";
import { Types } from "mongoose";

export interface IOfferCouponRepository {
  createOffer(data: Partial<IOffer>): Promise<IOffer>;
  providerOfferslist(providerId:string, page:number,limit:number): Promise<IOffer[]>
  
    offersFindById(id: string): Promise<IOffer | null>;  
    changeOfferStatus(id: string,status:string,admin:string): Promise<boolean | null>;
     updateOffer(id: string|Types.ObjectId, data: Partial<IOffer>): Promise<IOffer>
  
}
