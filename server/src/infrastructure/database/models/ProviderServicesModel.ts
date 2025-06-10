import mongoose, { Schema, Document, Types } from 'mongoose';
import {IproviderServices} from "../../../domain/models/IproviderServices"

const ProviderServicesSchema: Schema = new Schema(
  {
    serviceId: { type: Types.ObjectId,ref: 'Service' },
    subcategoryId: { type: Types.ObjectId, required: true,ref:'Subcategories'},
    description:{type:String,required:true},
    features:{type:String},
    service:{type: String},
    subcategoryName: { type: String },
    image:{type:String},
    status: { type: String, default: 'Active' },    
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' }, 
    updatedBy: { type: Types.ObjectId, ref: 'User' }, 
  },
  {
    timestamps: true, 
  }
);

const ProviderServicesModel = mongoose.model<IproviderServices>('ProviderService', ProviderServicesSchema);

export { ProviderServicesModel, IproviderServices };
