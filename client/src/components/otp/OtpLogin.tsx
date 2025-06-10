import React, { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/UserSlice";
interface LocationState {
  otpEmail: string;
  returnUrl: string;
  otp:number,
  userType:string
}
interface OtpInputBoxProps {
  title?: string;
  onSend: (userOtp: string) => void;
  onResend: () => void;
  countdown?: number;
}

const OtpLogin: React.FC<OtpInputBoxProps> = ({
  title = "OTP Verification",
  onSend,
  onResend,
  countdown = 20,
}) => {
  const [userOtp, setUserOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(countdown);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSendDisabled, setIsSendDisabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { otpEmail = "", returnUrl = "", otp = "",userType="" } = (location.state || {}) as LocationState;
   const dispatch = useDispatch(); 
  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendEnabled(true);
    }

    if (!otpEmail || !returnUrl) {
      navigate("/");
    }
  }, [timeLeft,otpEmail, returnUrl, navigate]);

  const handleSend = async () => {
    setIsSendDisabled(true);

    try {
      const response = await axios.post( `${API}/api/validateOtp`, {
        otpEmail,
        userOtp,
        userType
      }, { withCredentials: true });
      if (response.data.isValid) {
        const { accessToken } = response.data;
        localStorage.setItem("currentRole", userType); // Store role for token lookup
        localStorage.setItem(`${userType}_accessToken`, accessToken);
        localStorage.setItem(
          `${userType}_user`,
          JSON.stringify(response.data.user)
        );
                dispatch(setUser(response.data.user));
        
        navigate(returnUrl);
      } else {
        setIsOtpValid(false);
        setErrorMessage('Incorrect OTP. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }

    // Enable the resend button after 5 minutes (for OTP resend)
    setTimeout(() => {
      setIsSendDisabled(false);
    }, 5 * 60 * 1000); // 5 minutes timeout
  };

  const handleResend = async () => {
    setErrorMessage(null);
    setIsOtpValid(true);

    try {
      await axios.post(`${API}/api/emailVerification`,
          { email:otpEmail, userType},
          { withCredentials: true });

      setTimeLeft(10); // Reset countdown
      setResendEnabled(false);
    } catch (error) {
      setErrorMessage('Error while resending OTP. Please try again later.');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white px-8 py-10 rounded shadow-md border-2 border-[#5F60B9] w-[340px] text-center">
        <h2 className="text-lg font-medium mb-6">{title}</h2>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Enter OTP"
            value={userOtp}
            onChange={(e) => setUserOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-full bg-[#f2f3f5] text-center text-sm focus:outline-none"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-sm text-gray-700">
          <span>{timeLeft}</span>
            <FiClock />
          </div>
        </div>
        {errorMessage && (
          <div className="mb-4 text-red-600 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleResend}
            disabled={!resendEnabled}
            className={`px-4 py-2 rounded-full border-2 text-sm font-semibold ${
              resendEnabled
                ? "border-[#5F60B9] text-[#5F60B9]"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            RESEND OTP
          </button>

          <button
            onClick={handleSend}
            className="px-6 py-2 text-white text-sm font-semibold rounded-full bg-[#5F60B9] hover:opacity-90"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpLogin;
