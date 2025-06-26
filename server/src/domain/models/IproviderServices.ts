import mongoose, { Schema, Document, Types } from 'mongoose';

export interface  IproviderServices {
    _id:string | Types.ObjectId;
    serviceId: Types.ObjectId|string,
    subcategoryId: Types.ObjectId|string,
    description?:string,
    features?:string|null,
    service?:string,
    subcategoryName?: string,
    image?:string,
    amountPerHour?:number,
    averageTimeInHours?:number,
    totalAmount?:number,
    status?: string,    
    createdBy:Types.ObjectId|string, 
    updatedBy?:Types.ObjectId|string,

    
 
 
}

