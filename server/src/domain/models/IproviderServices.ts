import mongoose, { Schema, Document, Types } from 'mongoose';

export interface  IproviderServices {
    _id:string | Types.ObjectId;
    serviceId: Types.ObjectId|string,
    subcategoryId: Types.ObjectId|string,
    description:String,
    features:string|null,
    service:string,
    subcategoryName: string,
    image:string,
    status: string,    
    createdBy:Types.ObjectId|string, 
    updatedBy:Types.ObjectId|string,
 
 
}

