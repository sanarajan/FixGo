import React, { useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Props {
  data: any;
  setShowPopup: () => void;
  refresh?: () => void;
  userType?: string;
  api: string;
}
const DeleteConfirmPopup: React.FC<Props> = ({
  data,
  setShowPopup,
  refresh,
  userType,
  api,
}) => {
  const [busy, setBusy] = useState(false);
  const handleConfirm = async () => {
    setBusy(true);
    try {
      let deletres = await axiosClient.delete(`${api}/${data._id}`, {
        headers: { userRole: userType },
      });
      if (deletres.status === 200) {
        toast.success("Deleted successfully!", { autoClose: 500 });
        setTimeout(() => {
          refresh?.();
          setShowPopup();
        }, 800);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Error");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <ToastContainer position="top-center" />
      <div className="bg-white w-[320px] p-6 rounded-xl shadow-xl">
        <h3 className="text-center font-semibold mb-6 text-[#7879CA]">
          Are you sure, Delete ?{/* “{data.serviceName}”? */}
        </h3>

        <div className="flex justify-center gap-4">
          <button
            onClick={setShowPopup}
            className="px-6 py-1 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            No
          </button>

          <button
            disabled={busy}
            onClick={handleConfirm}
            className={`px-6 py-1 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 transition-colors ${
              busy && "opacity-60 cursor-not-allowed"
            }`}
          >
            {busy ? "Deleting…" : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmPopup;
