interface OfferFormData {
  offerName:string;
  offerFor: string;
  serviceId: string;
  subcategoryId?: string;
  providerServiceId?: string;
  offerType: string;
  offerValue: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string }; // errors keyed by field name
}
let isValid =true
export const validateOfferForm = (data: OfferFormData): ValidationResult => {
  const errors: { [key: string]: string } = {};

   if (!data.offerName) {
    errors.offerFor = "Offer name required";
    isValid =false
  }
  if (!data.offerFor) {
    errors.offerFor = "Please select offer type (Service or Subcategory).";
    isValid =false
  }

  if (!data.serviceId) {
    errors.serviceId = "Please select a service.";
     isValid =false
  }

  if (data.offerFor === "subcategory") {
    if (!data.subcategoryId) {
      errors.subcategoryId = "Please select a subcategory.";
       isValid =false
    }
    if (!data.providerServiceId) {
      errors.providerServiceId = "Provider service ID is missing for subcategory.";
       isValid =false
    }
  }

  if (!data.offerType || !["percentage", "price"].includes(data.offerType)) {
    errors.offerType = "Please select a valid offer type.";
     isValid =false
  }

  if (
    !data.offerValue ||
    isNaN(Number(data.offerValue)) ||
    Number(data.offerValue) <= 0
    
  ) {
    errors.offerValue = "Offer value must be a number greater than 0.";
     isValid =false
  }

  if (!data.startDate) {
    errors.startDate = "Please select a start date.";
     isValid =false
  } else {
    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(data.startDate).setHours(0, 0, 0, 0);
    if (start < today) {
      errors.startDate = "Start date cannot be before today.";
       isValid =false
    }
  }

  if (!data.endDate) {
    errors.endDate = "Please select an end date.";
     isValid =false
  } else if (data.startDate) {
    const start = new Date(data.startDate).setHours(0, 0, 0, 0);
    const end = new Date(data.endDate).setHours(0, 0, 0, 0);
    if (end < start) {
      errors.endDate = "End date cannot be before start date.";
       isValid =false
    }
  }

  if (!data.description || data.description.trim().length < 3) {
    errors.description = "Please enter a valid description (min 3 characters).";
     isValid =false
  }

  return {
    isValid:  isValid ,
    errors,
  };
};
