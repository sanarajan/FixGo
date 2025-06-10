import mongoose, { Schema, Document, Types } from 'mongoose';
import {IproviderServices} from "../../../domain/models/IproviderServices"

const StaffServicesSchema: Schema = new Schema(
  {
    staffId:{type:Types.ObjectId,ref: 'User'},
    providerServiceId:{type: Types.ObjectId,ref: 'providerservices'},
    subcategoryId: { type: Types.ObjectId, required: true,ref:'Subcategories'},   
    serviceId:{ type: Types.ObjectId, required: true,ref:'Service'},
    service:{type: String},
    subcategoryName: { type: String },
    status: { type: String, default: 'Active' },    
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' }, 
    updatedBy: { type: Types.ObjectId, ref: 'User' }, 
  },
  {
    timestamps: true, 
  }
);

const StaffServicesModel = mongoose.model<IproviderServices>('StaffServices', StaffServicesSchema);

export { StaffServicesModel, IproviderServices };
