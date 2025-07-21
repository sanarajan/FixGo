import React, { useState } from "react";
import dayjs from "dayjs";
import axiosClient from "../../../api/axiosClient";
import { IOrder } from "../../../providers/pages/bookings/OrderInterface";
import ProviderCancelBooking from "./ProviderCancelBooking";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  data: IOrder;
  setShowPopup: () => void;
  mode: string;
  refresh?: () => void;
}

const BookingStatusUpdatePopup: React.FC<Props> = ({
  data,
  setShowPopup,
  mode,
  refresh,
}) => {
  const [otp, setOtp] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [otpError, setOtpError] = useState<string>("");
  const [purchaseCharge, setPurchaseCharge] = useState("");
  const [remainingCharge, setRemainingCharge] = useState<string>(
    data.amount.remaining.toString()
  );

  const today = dayjs().format("YYYY-MM-DD");
  const bookingDate = dayjs(data.createdAt).format("YYYY-MM-DD");

  const updateStatus = async (status: string, payload: any = {}) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/api/provider/updateBookingStatus/${data._id}`, {
        bookingStatus: status,
        ...payload,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmBooking = async () => {
    alert("fgjgh");
    try {
      setLoading(true);
      const res = await axiosClient.patch(`/api/provider/updateBookingStatus`, {
        bookingStatus: "Upcoming",
        bookingId: data._id,
        email: data.customerId.email,
      });
      if (res.status === 200) {
        toast.success("Status updated successfully");
        setTimeout(() => {
          refresh?.();
          setShowPopup();
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to confirm booking:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOtpSubmit = async () => {
    try {
      let valid = true;
      if (!otp.trim() || otp.trim() === "") {
        setOtpError("Required Field");
        valid = false;
      }
      if (valid) {
        const res = await axiosClient.post(`/api/provider/bookingOtpVerify`, {
          otp,
          bookingId: data._id,
          email: data.customerId.email,
        });
        if (res.status === 200) {
          toast.success("Status updated successfully");
          setTimeout(() => {
            refresh?.();
            setShowPopup();
          }, 1000);
        }
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleInvoiceSubmit = async () => {
    if (!invoiceAmount || !purchaseCharge || !remainingCharge) {
      toast.error("Please fill all invoice fields");
      return;
    }

    const payload = {
      invoiceAmount: parseFloat(invoiceAmount),
      purchaseCharge: parseFloat(purchaseCharge),
      remainingCharge: parseFloat(remainingCharge),
      bookingId: data._id,
      email: data.customerId.email,
    };

    try {
      const res = await axiosClient.post(
        `/api/provider/endServiceWithInvoice`,
        payload
      );
      if (res.status === 200) {
        toast.success("Service completed and invoice submitted");
        setTimeout(() => {
          refresh?.();
          setShowPopup();
        }, 1000);
      }
    } catch (err) {
      toast.error("Failed to complete service");
      console.error(err);
    }
  };

  const status = data.bookingStatus;
  const API = import.meta.env.VITE_API_URL;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={setShowPopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {status === "Pending" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Booking Confirmation</h2>
            <p className="text-sm text-gray-500 mb-4">
              If you are not ready to accept this booking, you can cancel the
              booking. Or you can confirm the booking to proceed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
                // disabled={loading}
              >
                Cancel Booking
              </button>
              <button
                onClick={handleConfirmBooking}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </>
        )}

        {status === "Upcoming" && (
          <>
            <h2 className="text-xl font-semibold mb-2">OTP Verification</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border p-2 w-full mb-4 rounded"
            />
            {otpError && <p className="">{otpError}</p>}
            <button
              onClick={handleOtpSubmit}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Verify OTP
            </button>
          </>
        )}

        {status === "Ongoing" && (
          <>
            <h2 className="text-xl font-semibold mb-2">End Service</h2>
           
            <span>
              <label>Remaining Charge:</label>
              <span className="text-green-600">
                <strong> {remainingCharge}</strong>
              </span>
            </span>
            <br></br>
            <label>Purchase Charge:</label>
            <input
              type="number"
              value={purchaseCharge}
              onChange={(e) => {
                const value = e.target.value;
                setPurchaseCharge(value);

                const purchase = parseFloat(value || "0");
                const remaining = parseFloat(remainingCharge || "0");
                const total = purchase + remaining;
                setInvoiceAmount(total.toString());
              }}
              placeholder="Enter Purchase Charges"
              className="border p-2 w-full mb-2 rounded"
            />
            <label>Total payable  Charge:</label>
            <input
              type="number"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              placeholder="Total Invoice Amount"
              className="border p-2 w-full mb-2 rounded"
              readOnly
            />
            <button
              onClick={handleInvoiceSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Complete Service
            </button>
          </>
        )}

        {(status === "Completed" || status === "Cancelled") && (
          <div className="text-center text-gray-600">
            This booking is <strong>{status}</strong>. No action needed.
          </div>
        )}
      </div>

      <ProviderCancelBooking
        show={showCancelModal}
        // cancelOptions={cancelOptions}
        bookingId={data._id}
        API={API}
        onClose={() => setShowCancelModal(false)}
        serviceDateTime={data.createdAt}
        refresh={refresh}
      />
    </div>
  );
};

export default BookingStatusUpdatePopup;
