// validation.ts

export interface ForgotData {
    password: string;
    confirmPassword: string;
  }
  
  interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof ForgotData, string>>;
  }
  
  export const ResetPasswordValidation = (data: ForgotData): ValidationResult => {
    const errors: ValidationResult["errors"] = {};
  
    if (!data.password.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  
    if (!data.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
    } else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  
  export const handleFieldChange = (
    field: keyof ForgotData,
    value: string,
    allValues: ForgotData
  ): string => {
    if (field === "password") {
      if (!value.trim()) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
    }
  
    if (field === "confirmPassword") {
      if (!value.trim()) return "Confirm password is required";
      if (value !== allValues.password) return "Passwords do not match";
    }
  
    return "";
  };
  