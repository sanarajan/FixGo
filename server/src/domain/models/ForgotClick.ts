import mongoose, { Types } from "mongoose";

export interface ForgotClick {
       userId: string | Types.ObjectId,
    
    token:string,
    expiresAt: Date;
    clicked: boolean;
    linkCreatedAt: Date;
  }