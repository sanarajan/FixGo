import mongoose, { Schema, Document, Types } from 'mongoose';
  

  type Subcategory = {
    _id: string;
    subcategory: string;
  };
  
  export type GroupedProviderService = {
    serviceId: string;
    serviceName: string;
    subcategories: Subcategory[];
  };