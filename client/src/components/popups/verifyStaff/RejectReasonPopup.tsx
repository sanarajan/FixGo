import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import adminAxiosClient from "../../../api/adminAxiosClient";

interface RejectReasonPopupProps {
  data: { _id: string };
  setShowPopup: () => void;
  api: string;
  refresh?: () => void;
}

const RejectReasonPopup: React.FC<RejectReasonPopupProps> = ({
  data,
  setShowPopup,
  api,
  refresh,
}) => {
  const [reason, setReason] = useState<string>("");

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason.");
      return;
    }

    try {
      await adminAxiosClient.post(api, {
        staffId: data._id,
        reason,
        data:data
      });
      toast.success("Staff rejected successfully");
      setShowPopup();
      refresh?.();
    } catch (err) {
      toast.error("Failed to reject staff");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="p-6 bg-white rounded-xl shadow-md w-[90%] max-w-md">
        <h3 className="text-lg font-bold mb-3 text-[#5A52A4]">Reject Staff</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border p-2 rounded h-24"
          placeholder="Enter reason for rejection"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={setShowPopup}
            className="bg-gray-300 text-black px-4 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectReasonPopup;
