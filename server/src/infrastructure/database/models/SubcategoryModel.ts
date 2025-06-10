import mongoose, { Schema, Document, Types } from 'mongoose';
import {IServiceSubcategories} from "../../../domain/models/IServiceSubcategories"

const SubcategorySchema: Schema = new Schema(
  {
    serviceId: { type: Types.ObjectId, required: true,ref: 'Service' },
    subcategory: { type: String, required: true },

    status: { type: String, default: 'Active' },    
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' }, 
    updatedBy: { type: Types.ObjectId, ref: 'User' }, 
  },
  {
    timestamps: true, 
  }
);

const SubcategoryModel = mongoose.model<IServiceSubcategories>('Subcategories', SubcategorySchema);

export { SubcategoryModel, IServiceSubcategories };
