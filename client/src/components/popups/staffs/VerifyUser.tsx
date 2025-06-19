import React, { useEffect, useState } from "react";
import adminAxiosClient from "../../../api/adminAxiosClient";
import { ToastContainer, toast } from "react-toastify";
import { FiClock } from "react-icons/fi";

interface VerifyUserProps {
  data: any;
  setShowPopup: () => void;
  refresh: () => void;
  params: { api: string };
}

const VerifyUser: React.FC<VerifyUserProps> = ({
  data,
  setShowPopup,
  refresh,
  params,
}) => {
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30); // countdown from 30s
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sent && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setResendEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [sent, timeLeft]);

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await adminAxiosClient.post(`/api/admin/verifyStaff`, {
        email: data.email,
        userType: "provider",
      });
      if (response.status === 200) {
        setSent(true);
        setTimeLeft(30); // restart timer
        setResendEnabled(false);
        setError("");
        toast.success("OTP sent successfully!", {
          autoClose: 2000,
        });
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      const response = await adminAxiosClient.post(
        `/api/admin/validateStaffVerifyOtp`,
        {
          staffId: data._id,
          otpEmail: data.email,
          userOtp: otp,
          userType: "provider",
        }
      );
      if (response.data.isValid) {
         toast.success("Staff verified successfully!"); 
         setTimeout(() => {
              refresh();
        setShowPopup();
              
              }, 1000);
       // Close popup
       
      } else {
        setError("Incorrect OTP. Please try again.");
      }
    } catch (err : any ) {
       console.log(err);
  const errorMessage =
    err.response?.data?.message ||
    err.response?.data?.error || // in case you send "error" key
    "Something went wrong. Please try again.";

  setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow w-full max-w-sm relative">
        <h2 className="text-lg font-semibold mb-4">Verify Staff: {data?.fullname}</h2>

        {!sent ? (
          <>
            <p>Send OTP to: <strong>{data.email}</strong></p>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded mt-4"
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-1 text-sm text-gray-600">
                <span>{timeLeft}</span>
                <FiClock />
              </div>
            </div>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="flex justify-between items-center gap-4">
              <button
                onClick={sendOtp}
                disabled={!resendEnabled}
                className={`px-4 py-1 rounded text-sm border ${
                  resendEnabled
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                RESEND OTP
              </button>

              <button
                className="bg-green-500 text-white px-4 py-1 rounded"
                onClick={verifyOtp}
                disabled={loading || !otp}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </>
        )}

        <button
          onClick={setShowPopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default VerifyUser;
