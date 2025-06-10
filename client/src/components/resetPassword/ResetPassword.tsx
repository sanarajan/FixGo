import React, { useState } from 'react';
import {getLastSegmentFromPath,getCurrentUserRole}  from "../../utils/RoleHelper"
import {logout} from "../../utils/LogoutHelper"
import {useNavigate} from "react-router-dom"
import { ToastContainer, toast } from "react-toastify";

import {
    ForgotData,
    ResetPasswordValidation,
    handleFieldChange,
  } from "./ResetPasswordValidation";
  import axios from "axios";

interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ForgotData, string>>;
}

const ResetPassword = () => {
  const [formData, setFormData] = useState<ForgotData>({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<ValidationResult['errors']>({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
   
    setFormData((prev) => {
      const newForm = { ...prev, [name]: value };
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: handleFieldChange(name as keyof ForgotData, value, newForm),
      }));
      return newForm;
    });
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    toast.dismiss();
    const validationResult = ResetPasswordValidation(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }
  
    try {
        const API = import.meta.env.VITE_API_URL;
        const token = getLastSegmentFromPath()
        const response = await axios.post(
            `${API}/api/resetPassword`,
            {  password: formData.password,token},
            { withCredentials: true }
          );     
  
      if (response.status === 200) {
        setSuccess("Password reset successfully!");
        setFormData({ password: "", confirmPassword: "" });
        setErrors({});
        const role =getCurrentUserRole()     
       toast.success(success)
        setTimeout(() => {
            logout(role);
          }, 1000);
       
      } else {
        setSuccess(""); // Clear success in case of non-200
        toast.error("Failed to reset password. Please try again.")

      }
    } catch (error: any) {
      setSuccess("");
       toast.error(error?.response?.data?.message || "Something went wrong. Please try again.")
    
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f9f9ff] p-6 overflow-hidden">
       <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
      <div
        className="absolute inset-0 bg-center bg-cover opacity-10"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80")',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 backdrop-blur-md p-8 rounded-xl shadow-[0_4px_30px_rgba(90,82,164,0.25)] border border-[#5A52A4]/30">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#4f459c]">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#5A52A4] mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#5A52A4]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A52A4] focus:border-[#5A52A4]"
              
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#5A52A4] mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#5A52A4]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A52A4] focus:border-[#5A52A4]"
              
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <button
            type="submit"
            className="w-full bg-[#5A52A4] hover:bg-[#4a448f] text-white py-2 rounded-md transition-all shadow-md"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;