import React from "react";

interface ViewOfferPopupProps {
  data: any;
  setShowPopup: () => void;
}

const ViewOfferPopup: React.FC<ViewOfferPopupProps> = ({ data, setShowPopup }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
          onClick={setShowPopup}
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold text-[#5A52A4] mb-4">Offer Details</h2>
        <div className="space-y-2 text-sm text-gray-800">
          <p><strong>Offer Name:</strong> {data.offerName}</p>
          <p><strong>Offer For:</strong> {data.offerFor}</p>
          <p><strong>Service:</strong> {data.serviceId?.serviceName || "N/A"}</p>
          {data.offerFor === "subcategory" && (
            <p><strong>Subcategory:</strong> {data.subcategoryId?.subcategory || "N/A"}</p>
          )}
          <p><strong>Type:</strong> {data.offerType === "percentage" ? "Percentage (%)" : "Fixed Price (₹)"}</p>
          <p><strong>Value:</strong> {data.offerValue}</p>
          <p><strong>Start Date:</strong> {data.startDate?.slice(0, 10)}</p>
          <p><strong>End Date:</strong> {data.endDate?.slice(0, 10)}</p>
          <p><strong>Description:</strong> {data.description}</p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={setShowPopup}
            className="bg-[#5A52A4] text-white px-4 py-2 rounded hover:bg-[#4a4299]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOfferPopup;
