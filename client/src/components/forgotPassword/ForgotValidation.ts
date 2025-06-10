// src/utils/formValidation.ts

interface forgotData {  
    email: string;    
  }
  
  interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof forgotData, string>>;
  }
  
  export const ForgotValidation = (data: forgotData): ValidationResult => {
    const errors: ValidationResult["errors"] = {};   
  
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email format";
    } 
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };


  export const validateField = (
    name: keyof forgotData,
    value: string,
    formData: forgotData
  ): string => {
   if(name==="email"){
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
       
    }
  
    return "";
  };
  