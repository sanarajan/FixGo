import React, { useState, useEffect } from "react";
import {
  getCurrentUserRole,
  getDashboardRedirectPath,
} from "../../utils/RoleHelper";
import { FaGoogle, FaPhone } from "react-icons/fa";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import {
  LoginValidation,
  LoginFormData,
  OtpFormData,
  handleOtpFieldChange,
  otpFormValidation,
} from "./LoginValidation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleLoginButton from "./GoogleLoginButton";
import { getRoleFromPath } from "../../utils/RoleHelper";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/UserSlice";
import { setAdminUser } from "../../redux/AdminSlice";
import { setProviderUser } from "../../redux/ProviderSlice";

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  PROVIDER = "provider",
  WORKER = "worker",
  STAFF = "staff", // Add other roles as needed
}
interface LoginProps {
  imageSrc: string;
  showGoogleAuth?: boolean;
  showOtpLogin?: boolean;
  redirectPath?: string;
  forgotPasswd?: boolean;
  haveOrNotAccount?: boolean;
  reqUrl: string;
  userType: UserRole;
}

interface UserInfo {
  _id?: string;
  fullname?: string;
  companyName?: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  providerId?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserInfo;
}
interface OtpResponse {
  otp: number;
}

const RedirectPaths: Record<UserRole, string> = {
  [UserRole.ADMIN]: "/admin/dashboard",
  [UserRole.CUSTOMER]: "/home",
  [UserRole.STAFF]: "/staff/home",
  [UserRole.PROVIDER]: "/provider/home",
  [UserRole.WORKER]: "/worker/home",
};
const Login: React.FC<LoginProps> = ({
  imageSrc,
  showGoogleAuth,
  showOtpLogin,
  haveOrNotAccount,
  redirectPath,
  reqUrl,
  userType,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLaoding] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const API = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  useEffect(() => {
    const role = getCurrentUserRole();
    const accessToken = localStorage.getItem(`${role}_accessToken`);
    if (accessToken) {
      const redirectTo = getDashboardRedirectPath(role);
      navigate(redirectTo, { replace: true });
    }
  }, []);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof LoginFormData
  ) => {
    if (loginError) setLoginError("");

    if (field === "email") {
      setEmail(e.target.value);
    } else if (field === "password") {
      setPassword(e.target.value);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();
    const { isValid, errors } = LoginValidation({ email, password });
    if (!isValid) {
      setLoginError(Object.values(errors)[0] || "Invalid login credentials");
      toast.error(Object.values(errors)[0]);
      return;
    }

    try {
      setLaoding(true);
      const response: AxiosResponse<LoginResponse> = await axios.post(
        `${API}${reqUrl}`,
        { email, password, userType },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { accessToken } = response.data;
        localStorage.setItem("currentRole", userType); // Store role for token lookup
        localStorage.setItem(`${userType}_accessToken`, accessToken);
        localStorage.setItem(
          `${userType}_user`,
          JSON.stringify(response.data.user)
        );
        if (userType === "customer") {
          dispatch(setUser(response.data.user));
        } else if (userType === "provider") {
          dispatch(setProviderUser(response.data.user));
        } else if (userType === "admin") {
          dispatch(setAdminUser(response.data.user));
        }

        setEmail("");
        setPassword("");

        const redirectTo = redirectPath || RedirectPaths[userType] || "/";
        toast.success("Login successfulll! Redirecting...", {
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate(redirectTo,{state: { userType } });

        }, 1000);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setLoginError(message);
      toast.error(message);
    } finally {
      setLaoding(false);
    }
  };
  let pathname = window.location.pathname;

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof OtpFormData
  ) => {
    const { value, error } = handleOtpFieldChange(e, field); // Calling the imported one
    setOtpEmail(value);
    setOtpError(error || "");
  };

  const handleOtpLoginClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    toast.dismiss();
    const { isValid, errors } = otpFormValidation({ otpEmail: otpEmail });
    if (errors) {
      setOtpError(errors.otpEmail || "");
      toast.error(errors.otpEmail);
    }
    if (isValid) {
      try {
        const response: AxiosResponse<OtpResponse> = await axios.post(
          `${API}/api/emailVerification`,
          { email: otpEmail, userType },
          { withCredentials: true }
        );
        if (response.status === 200) {
          const { otp } = response.data;
          setEmail("");
          setPassword("");

          toast.success("Login successfulll! Redirecting...", {
            autoClose: 1000,
          });
          let otpRedirect = window.location.pathname;

          if (otpRedirect === "/") {
            otpRedirect = "/home";
          } else {
            otpRedirect = otpRedirect + "/dashboard";
          }
          //avigate(pathname+"otp")
          setTimeout(() => {
            navigate(pathname + "otp", {
              state: {
                otpEmail,
                otp,
                userType,
                returnUrl: otpRedirect,
              },
            });
          }, 1000);
        } else {
          throw new Error("Unexpected response");
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const message =
            err.response.data?.message ||
            "Verification failed. Please try again.";
          setOtpError(message);
          toast.error(message);
        } else {
          setOtpError("Verification failed. Please try again.");
          toast.error("Verification failed. Please try again.");
        }
      } finally {
        setLaoding(false);
      }
    }
  };

  if (pathname !== "/") {
    pathname = pathname + "/";
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="hidden md:flex flex-1 justify-center items-center">
        <img src={imageSrc} alt="Service Login" className="w-[70%] h-auto" />
      </div>

      <div className="w-[90%] md:w-[400px] bg-white p-6 rounded-2xl shadow-lg me-6">
        <h2 className="text-2xl font-bold text-center">Sign IN</h2>
        <p className="text-sm text-center text-gray-500 mb-4 ">GET SERVICES</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => handleFieldChange(e, "email")}
            className="w-full mb-3 p-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="relative w-full mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => handleFieldChange(e, "password")}
              className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPassword ? "👁" : "👁️‍🗨️"}
            </button>
          </div>

          {loginError && (
            <div className="text-red-500 text-sm mb-2">{loginError}</div>
          )}

          <div className="text-right mb-4">
            <Link
              to="forgotPassword"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="loginButton w-full text-white py-2 rounded-2xl font-medium bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {haveOrNotAccount && (
          <>
            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <Link
                to={`${pathname}register`}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </>
        )}
        {showGoogleAuth && (
          <>
            {/* <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-3 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
            <button className="w-full flex items-center justify-center border border-indigo-600 text-indigo-600 py-2 rounded-2xl hover:border-indigo-700 hover:text-indigo-700 transition-all duration-200">
              <FaGoogle className="mr-2" />
              Sign in with Google
            </button> */}

            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-3 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
            <GoogleLoginButton
              userType={userType}
              redirectPath={redirectPath}
            />
            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-3 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
          </>
        )}

        {showOtpLogin && (
          <div className="mt-4">
            <input
              type="email"
              placeholder="Email"
              value={otpEmail}
              onChange={(e) => handleOtpChange(e, "otpEmail")}
              className="w-full mb-3 p-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {otpError && (
              <div className="text-red-500 text-sm mb-2">{otpError}</div>
            )}
            <button
              onClick={handleOtpLoginClick}
              className="loginButton w-full flex items-center justify-center text-white py-2 rounded-2xl font-medium bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
            >
              <FaPhone className="mr-2" />
              Login with OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
