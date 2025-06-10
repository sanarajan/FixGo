
import mongoose, {  Document, Types } from 'mongoose';

export interface Iaddresses extends Document {
  userId: string | Types.ObjectId|null;
  status?: string;
  location:string
  longitude:number,
  latitude:number,
   geoLocation: {
    type: string,
   coordinates: [number|null,number|null],
 // this must be [lng, lat]
  },
  current?:boolean,
  createdAt: Date;
  updatedAt?: Date;
  createdBy: Types.ObjectId|string;
  updatedBy?: Types.ObjectId|string; 
}

 