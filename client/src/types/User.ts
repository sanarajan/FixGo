export interface User {
    _id?: string; 
    fullname?: string;
    companyName?: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    providerId?: string;
    verified?:boolean;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  