
import mongoose, {  Document, Types } from 'mongoose';

export interface IService extends Document {
  _id:string | Types.ObjectId;
  serviceName: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId; 
}

export interface tokenUserData{
  role:string|null,
  id: Types.ObjectId
}