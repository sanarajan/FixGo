// src/utils/formValidation.ts

interface SignUpFormData {
    fullname: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role:string
  }
  
  interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof SignUpFormData, string>>;
  }
  
  export const CustomerValidation = (data: SignUpFormData): ValidationResult => {
    const errors: ValidationResult["errors"] = {};
   
    if (!data.fullname.trim()) {
      errors.fullname = "Full name is required";
      
    }
  
    if (!data.username.trim()) {
      errors.username = "Username is required";
    }
  
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email format";
    }
  
    if (!data.phone.trim()) {
      errors.phone = "phone number is required";
    // } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
    } else if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = "phone number must be 10 digits";
    }else if(data.phone.trim()==="0000000000"){
      errors.phone = "Invalid phone number";
    }else if (/^(\d)\1{9}$/.test(data.phone)) {
      errors.phone = "Invalid phone number (repeating digits)";
    }
    
  
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  
    if (!data.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };


  export const validateField = (
    name: keyof SignUpFormData,
    value: string,
    formData: SignUpFormData
  ): string => {
    switch (name) {
    
  
      case "fullname":
        if (!value.trim()) {
          return "Fullname is required";
        }
        break;
  
      case "username":
        if (!value.trim()) return "Username is required";
        break;
  
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        break;
  
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
        if (/^(\d)\1{9}$/.test(value)) return "Invalid phone number (repeating digits)";
        
        break;
  
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
  
      case "confirmPassword":
        if (!value) return "Confirm password is required";
        if (value !== formData.password) return "Passwords do not match";
        break;
  
      default:
        return "";
    }
  
    return "";
  };
  