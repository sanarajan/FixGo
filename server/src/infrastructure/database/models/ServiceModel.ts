import mongoose, { Schema, Document, Types } from 'mongoose';
import {IService} from "../../../domain/models/Iservices"

const ServiceSchema: Schema = new Schema(
  {
    serviceName: { type: String, required: true, unique: true },
    status: { type: String, default: 'Active' },    
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' }, 
    updatedBy: { type: Types.ObjectId, ref: 'User' }, 
  },
  {
    timestamps: true, 
  }
);

const ServiceModel = mongoose.model<IService>('Service', ServiceSchema);

export { ServiceModel, IService };
