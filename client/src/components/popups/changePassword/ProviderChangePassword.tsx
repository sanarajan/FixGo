import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { getRoleFromPath } from "../../../utils/RoleHelper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResetPasswordValidation } from "../../resetPassword/ResetPasswordValidation";
import {logout} from "../../../utils/LogoutHelper"

type ProviderChangePasswordProps = {
  close: () => void;
};
export interface passwordData {
  password: string;
  confirmPassword: string;
}
interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof passwordData, string>>;
}
const ProviderChangePassword = ({ close }: ProviderChangePasswordProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationResult["errors"]>({});
  const [formData, setFormData] = useState<passwordData>({
    password: "",
    confirmPassword: "",
  });
  const userType = getRoleFromPath();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();
    const validationResult = ResetPasswordValidation(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    try {
    
     const userType = "provider"
const formPayload = new FormData();
formPayload.append("password", formData.password);
        const response = await axiosClient.post(
        `/api/provider/providerPasswordReset`,
      formPayload,
        {
          headers: { "Content-Type": "application/json", userRole: userType },
        }
      );

      if (response.status === 200) {
        setFormData({ password: "", confirmPassword: "" });
        setErrors({});
        toast.success("Password updated successfully..");
         setTimeout(() => {
                    logout("provider");
                  }, 1000);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };
  const closePopup = () => {
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="bg-white rounded-xl shadow-xl w-[320px]">
        <div className="bg-[#5A52A4] text-white py-3 px-4 rounded-t-xl flex justify-between items-center">
          <span className="font-semibold">Change Password</span>
          <button
            onClick={closePopup}
            className="text-white text-lg font-bold hover:text-gray-300"
          >
            ✖️
          </button>
        </div>

        <div className="p-6 space-y-4">
          <label className="text-sm font-semibold px-2 py-3">
            Service name
          </label>
          <input
            type="text"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors["password"] && (
            <p className="text-sm text-red-500 -mt-2">{errors["password"]}</p>
          )}
          <label className="text-sm font-semibold px-2 py-3">
            {" "}
            Confirm pasword
          </label>

          <input
            type="text"
            name="confirmPassword"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors["confirmPassword"] && (
            <p className="text-sm text-red-500 -mt-2">
              {errors["confirmPassword"]}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className={`w-full bg-[#5A52A4] text-white py-2 rounded-lg font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderChangePassword;
