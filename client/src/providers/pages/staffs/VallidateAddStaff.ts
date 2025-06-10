

  interface staffFormData {
    staffid:string|null,
    fullname: string,
    email: string,
    phone: string,
    location: string|null,
    image: string|null,
  }
  interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof staffFormData, string>>;
  }
  type Subcategory = {
    _id: string;
    name: string;
  };
  
   type GroupedProviderService = {
    serviceId: string;
    serviceName: string;
    subcategories: Subcategory[];
  };
export function validateForm(formData: {
    fullname: string;
    email: string;
    phone: string;
    location: string;
    image: File | null;
    staffid:string|null
  }) {
    const errors: { [key: string]: string } = {};
    let isValid = true;
  
    // Full Name
    if (!formData.fullname.trim()) {
      errors.fullname = "Full Name is required";
      isValid = false;
    }
  
    // Email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = "Invalid email address";
      isValid = false;
    }
  
    // Phone
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone) || /^(\d)\1{9}$/.test(formData.phone)) {
  errors.phone = "Phone must be 10 digits and not all the same digit";
  isValid = false;
}

    if (!formData.location.trim()) {
      errors.location = "Location is required";
      isValid = false;
    }
  if(!formData.staffid){
    // Image validation
      if (!formData.image) {
        errors.image = "Image is required";
        isValid = false;
      } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      const maxSize = 2 * 1024 * 1024; // 2 MB  
      if (!allowedTypes.includes(formData.image.type)) {
        errors.image = "Only JPG, PNG, GIF, or WEBP files are allowed";
        isValid = false;
      }
  
      if (formData.image.size > maxSize) {
        errors.image = "Image must be less than 2MB";
        isValid = false;
      }
    }
  }else{
     if(!formData.image){
      errors.image="Image is required";
       isValid = false;
     }
  }  
    return { isValid, errors };
  }
  export const isServiceSelectionValid = (selectedServices: { [key: string]: string[] }) => {
    return Object.values(selectedServices).some((subList) => subList.length > 0);
  };
  
  
  
  