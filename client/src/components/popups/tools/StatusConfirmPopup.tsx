import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axiosClient from "../../../api/axiosClient";

interface Props {
  data: any;
  setShowPopup: () => void;
  refresh?: () => void;
  userType?: string;
  api: string;
}

const StatusConfirmPopup: React.FC<Props> = ({
  data,
  setShowPopup,
  refresh,
  userType,
  api,
}) => {
  const [busy, setBusy] = useState(false);
  console.log(data.status + "  stu first");
  const nextStatus = data.status === "Active" ? "Inactive" : "Active";

  const handleConfirm = async () => {
    console.log(nextStatus + "  sttu");
    setBusy(true);
    try {
      const updated = await axiosClient.patch(
        `${api}/${data._id}`,
        { status: nextStatus },
        {
          headers: { userRole: userType },
        }
      );
      console.log(updated.status + "  stautus");
      if (updated.status === 200) {
        toast.success("Status updated successfully!", { autoClose: 500 });
        setTimeout(() => {
          refresh?.();
          setShowPopup();
        }, 1000);
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
          Change status to {nextStatus}?
        </h3>

        <div className="flex justify-center gap-4">
          <button
            onClick={setShowPopup}
            className="px-4 py-1 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={busy}
            onClick={handleConfirm}
            className={`px-4 py-1 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 transition-colors ${
              busy && "opacity-60 cursor-not-allowed"
            }`}
          >
            {busy ? "Saving…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusConfirmPopup;
