import mongoose, { Schema, Document, Types } from 'mongoose';

export interface  StaffProviderService {
    _id?:string | Types.ObjectId;
    staffId?:string | Types.ObjectId;
    providerServiceId:Types.ObjectId|string,
    serviceId: Types.ObjectId|string,
    subcategoryId: Types.ObjectId|string,   
    service?:string,
    subcategoryName?: string,
    status?: string,    
    createdBy:Types.ObjectId|string, 
    updatedBy?:Types.ObjectId|string,
 
 
}

