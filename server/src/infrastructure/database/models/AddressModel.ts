import mongoose, { Schema, Document, Types } from 'mongoose';
import {Iaddresses} from "../../../domain/models/Iaddresses"

const addressesSchema: Schema = new Schema(
  {
    userId:{type:Types.ObjectId,ref: 'User'},
     location:{type:String},
     geoLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], 
        required: true
      }
    },
     longitude:{type:Number },
     latitude:{type:Number },
     
    status: { type: String, default: 'Active' },   
    current:{
        type:Boolean,
        default:false
    } ,
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' }, 
    updatedBy: { type: Types.ObjectId, ref: 'User' },     
  },
  {
    timestamps: true, 
  }
);

addressesSchema.index({ geoLocation: '2dsphere' });

const AddressModel = mongoose.model<Iaddresses>('addresses', addressesSchema);

export { AddressModel, Iaddresses };
