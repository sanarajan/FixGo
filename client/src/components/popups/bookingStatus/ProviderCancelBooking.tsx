// components/CancelBookingModal.tsx
import React, { useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface CancelBookingModalProps {
//   cancelOptions: string[];
  show: boolean;
  onClose: () => void;
  bookingId: string;
  API: string;
  serviceDateTime: string; // <-- Added
  refresh?: () => void;
}
const cancelOptions = [
  "Change of plan",
  "Service no longer needed",
  "Booked by mistake",
  "Provider delay",
  "Other",
];
const ProviderCancelBooking: React.FC<CancelBookingModalProps> = ({
  show,
  onClose,
  bookingId,
  API,
  refresh,
//   cancelOptions,
  serviceDateTime,
}) => {
  if (!show) return null;

  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [errors, setErrors] = useState<{ reason?: string; other?: string }>({});

  const bookingTime = new Date(serviceDateTime); // the time the customer booked
  const currentTime = new Date();
  const diffInMs = currentTime.getTime() - bookingTime.getTime(); // how much time has passed since booking
  const diffInMinutes = diffInMs / (1000 * 60);
  const isEligibleForRefund = diffInMinutes <= 15;

  const validate = () => {
    const newErrors: { reason?: string; other?: string } = {};
    if (!cancelReason) newErrors.reason = "Please select a reason.";

    if (cancelReason === "Other" && !otherReason.trim()) {
      newErrors.other = "Please provide a reason.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleCancelBooking = async () => {
    if (!validate()) return;
    try {
      setLoadingCancel(true);
      const reasonToSend =
        cancelReason === "Other" ? otherReason : cancelReason;
      const API = import.meta.env.VITE_API_URL;
      const res = await axiosClient.patch(`${API}/api/provider/providerCancelBooking`, {
        bookingId,
        reason: reasonToSend,
        isEligibleForRefund,
      });

      if (res.status === 200) {
        toast.success("Booking cancelled successfully.");
        refresh && refresh();
        onClose();
      } else {
        const err = await res.data;
        alert("Failed to cancel booking: " + err.message);
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md">
        <div className="bg-[#5F60B9] rounded-t-xl px-6 py-2">
          <h2 className="text-white text-lg font-semibold">Cancel Booking</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            {isEligibleForRefund
              ? "Cancelling now will initiate a refund to your wallet."
              : "You are not eligible for a refund as more than 15 minutes have passed since booking."}
          </p>

          <select
            value={cancelReason}
            onChange={(e) => {
              setCancelReason(e.target.value);
              setErrors((prev) => ({ ...prev, reason: "" })); // Clear reason error
              if (e.target.value !== "Other") {
                setOtherReason(""); // Clear otherReason if not "Other"
                setErrors((prev) => ({ ...prev, other: "" }));
              }
            }}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="">Select a reason</option>
            {cancelOptions.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.reason && (
            <p className="text-red-500 text-sm mb-2">{errors.reason}</p>
          )}
          {cancelReason === "Other" && (
            <textarea
              className="w-full p-2 border rounded mb-3"
              placeholder="Please specify the reason"
              value={otherReason}
              onChange={(e) => {
                setOtherReason(e.target.value);
                setErrors((prev) => ({ ...prev, other: "" })); // Clear other error
              }}
            />
          )}
          {errors.other && (
            <p className="text-red-500 text-sm mb-2">{errors.other}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleCancelBooking}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              {loadingCancel ? "Cancelling..." : "Confirm Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCancelBooking;
