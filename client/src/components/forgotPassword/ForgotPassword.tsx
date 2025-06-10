import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios,{ AxiosResponse } from "axios";
import { ToastContainer, toast } from "react-toastify";
import {ForgotValidation} from "./ForgotValidation"
interface ForgotPasswordProps {
  userType: string;
  redirectPath: string; // e.g., "/api/auth/forgot-password"
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ userType, redirectPath }) => {
  const [email, setEmail] = useState("");
const  [error,setError]= useState("")
  const handleSend = async () => {
        toast.dismiss();
    
     const { isValid, errors } = ForgotValidation({ email });
    
        if (!isValid) {
          setError(Object.values(errors)[0] || "Invalid login credentials");
          toast.error(Object.values(errors)[0]);
          return;
        }
       
    try {
      const API = import.meta.env.VITE_API_URL;
      console.log(`${API}/api/forgotPassword`)
      const response = await axios.post(`${API}/api/forgotPassword`, {
        email,
        userType,
      }, { withCredentials: true });

      if (response.status === 200) {
        toast.success(response.data.result)
        toast.success("Password reset link sent to your email.");
        setEmail("");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to send reset link.";
      toast.error(message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f9f9ff] p-6 overflow-hidden">
        <div
        className="absolute inset-0 bg-center bg-cover opacity-10"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80")',
          zIndex: 0,
        }}
      />
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
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 backdrop-blur-md p-8 rounded-xl shadow-[0_4px_30px_rgba(90,82,164,0.25)] border border-[#5A52A4]/30">
      <h2 className="text-md font-semibold mb-6">Forgot Password</h2>

        <div className="relative mb-6">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md bg-[#f2f3f5] text-sm focus:outline-none"
          />
          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <button
          onClick={handleSend}
          className="w-full py-2 bg-[#5A52A4] text-white font-semibold text-sm rounded-md hover:opacity-90"
        >
          SEND
        </button>

        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#5A52A4] font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
      
    </div>
  );
};

export default ForgotPassword;
