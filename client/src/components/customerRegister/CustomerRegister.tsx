import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import { CustomerValidation,validateField } from "./CustomerValidation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios ,{ AxiosResponse } from "axios";
import { error } from "console";
interface SignUpProps {
  imageSrc: string;
}
type SignUpFormData = {
  fullname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string,
};
interface OtpResponse {  
  otp: number;
}
const SignUp: React.FC<SignUpProps> = ({ imageSrc }) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
   const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
 
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLaoding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };  
    setFormData(updatedForm);  
    // Clear error or update it immediately
    const error = validateField(name as keyof SignUpFormData, value, updatedForm);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
 const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();
    const { isValid, errors } = CustomerValidation(formData);
    try {
      if (isValid) {
        setLaoding(true);
        toast.dismiss();
        const API = import.meta.env.VITE_API_URL;

        const response = await axios.post(
          `${API}/api/register`,
          formData,
          {
            withCredentials: true, // Allow sending cookies
          }
        );
        if (response.status === 201) {
          console.log(response)
          const userData = response.data.user.email
       
          let userType="customer"
          const email=response.data.user.email;
          const userRole= response.data.user.role;
          try{
            const response: AxiosResponse<OtpResponse> = await axios.post(
              `${API}/api/emailVerification`,
              { email, userType},
              { withCredentials: true }
            );  
            if (response.status === 200) {   
              const { otp } = response.data;         
            
              
              toast.success("Register successfulll! Redirecting...", {
                autoClose: 2000,
              });
              console.log(window.location.pathname)
              let otpRedirect =window.location.pathname;
                 let pathname=window.location.pathname       
              if(otpRedirect==="/register"){
                otpRedirect ="/home"
              }else  if(otpRedirect==="/provider/register"){
                otpRedirect ="/provider/dashboard"
              }
              else{
                otpRedirect =otpRedirect+"/dashboard"
              }
             
           // navigate(pathname+"/tp")
              setTimeout(() => {
                navigate(pathname+"/otp", {
                  state: {
                    otpEmail:email,
                    otp,
                    userType:userRole,
                   returnUrl: otpRedirect, 
                  },
                });
              }, 2000);
            } else {
              throw new Error("Unexpected response");
            }
          } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
              const message = err.response.data?.message || "Verification failed. Please try again.";
             
           
            } else {
              toast.error("Verification failed. Please try again.");
            }
          } finally {
            setLaoding(false);
          }
        }
      } else {
        setErrors(errors);
        toast.error("All fields Required");
      }
    
    } catch (error:any) {     

      setLaoding(false);
      if (error.response && error.response.data?.error) {
        // from backend like "Email already exists"
        setErrorMessage(error.response.data.error); 
        toast.error(error.response.data.error);
      } else {
        setErrorMessage('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
      
    }
    
  };
   
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
     

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="hidden md:flex flex-1 justify-center items-center">
        <img
          src={imageSrc}
          alt="Sign Up Illustration"
          className="w-[80%] h-auto transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="w-[90%] md:w-[400px] bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Sign UP</h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Signup For Better Experience
        </p>

        <form>
      
          {errors.fullname && (
            <p className="text-sm text-red-500 mb-1">{errors.fullname}</p>
          )}
          <div
            className={`  flex items-center mb-3 bg-gray-100 rounded-xl border border-gray-200 px-3`}
          >
            <FaUser className="text-gray-500 mr-2" />

            <input
              type="text"
              placeholder="Fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
            
              className={` w-full p-3 bg-gray-100 focus:outline-none focus:ring-2  ${
                errors.fullname
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border border-gray-200 focus:ring-2 focus:ring-indigo-400"
              } rounded-xl`}
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-500 mb-1">{errors.username}</p>
          )}
          <div className="flex items-center mb-3 bg-gray-100 rounded-xl border border-gray-200 px-3">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              className={`w-full p-3 bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.username
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border border-gray-200 focus:ring-2 focus:ring-indigo-400"
              } rounded-xl`}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 mb-1">{errors.email}</p>
          )}
          <div className="flex items-center mb-3 bg-gray-100 rounded-xl border border-gray-200 px-3">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              className={`w-full p-3 bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border border-gray-200 focus:ring-2 focus:ring-indigo-400"
              } rounded-xl`}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500 mb-1">{errors.phone}</p>
          )}
          <div className="flex items-center mb-3 bg-gray-100 rounded-xl border border-gray-200 px-3">
            <FaPhone className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Mobile No"
              value={formData.phone}
              name="phone"
              onChange={handleChange}
              className={`w-full p-3 bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.phone
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border border-gray-200 focus:ring-2 focus:ring-indigo-400"
              } rounded-xl`}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mb-1">{errors.password}</p>
          )}
          <div className="flex items-center mb-3 bg-gray-100 rounded-xl border border-gray-200 px-3">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              className={`w-full p-3 bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border border-gray-200 focus:ring-2 focus:ring-indigo-400"
              } rounded-xl`}
            /><button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-gray-500 focus:outline-none"
          >
            {showPassword ? "👁" : "👁️‍🗨️"}
          </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mb-1">{errors.confirmPassword}</p>
          )}
          <div className="flex items-center mb-3 bg-gray-100 rounded-xl border border-gray-200 px-3">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              className={`w-full p-3 bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border border-gray-200 focus:ring-2 focus:ring-indigo-400"
              } rounded-xl`}
            /><button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="ml-2 text-gray-500 focus:outline-none"
          >
            {showConfirmPassword ? "👁"  :"👁️‍🗨️"}
          </button>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full text-white py-2 rounded-2xl font-medium bg-[#5F60B9] hover:bg-[#4a4b9e] transition-all duration-200"
          >
            Register
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-bold text-blue-600 cursor-pointer hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
