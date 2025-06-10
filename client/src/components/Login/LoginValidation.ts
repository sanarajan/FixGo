export interface LoginFormData {
  email: string;
  password: string;
}
interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof LoginFormData, string>>;
}

export interface OtpFormData {
  otpEmail: string;
}
type OtpValidationResult = {
  value: string;
  error?: string;
};
interface otpValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof OtpFormData, string>>;
}

export const LoginValidation = (data: LoginFormData): ValidationResult => {
  const errors: ValidationResult["errors"] = {};

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password.trim()) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const handleOtpFieldChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: keyof OtpFormData
): OtpValidationResult => {
  const value = e.target.value;
  let error;
  if (field === "otpEmail") {
    if (!value.trim()) {
      error = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email format";
    }
  }
  return { value, error };
};

export const otpFormValidation = (data: OtpFormData): otpValidationResult => {
  const errors: otpValidationResult["errors"] = {};

  if (!data.otpEmail.trim()) errors.otpEmail = "Email is required";
  if (!/\S+@\S+\.\S+/.test(data.otpEmail.trim()))
    errors.otpEmail = "Invalid email format";
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
