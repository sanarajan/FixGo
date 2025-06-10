import React, { useEffect, useState } from "react";
import ProviderLayout from "../../providerLayout/ProviderLayout";
import { useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import { IOrder } from "../../../providers/pages/bookings/OrderInterface";

// Accept props for popup usage:
interface ViewBookingDetailsProps {
  data?: IOrder;
  mode?: "view";
  setShowPopup?: () => void; // to close popup if needed
}

const ViewBookingDetails: React.FC<ViewBookingDetailsProps> = ({
  data,
  mode,
  setShowPopup,
}) => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<IOrder | null>(data ?? null);
  const [loading, setLoading] = useState(false);

  console.log(JSON.stringify(booking, null, 2) + "  orders");

  useEffect(() => {}, [id, data]);

  const API = import.meta.env.VITE_API_URL;

  const imagePath = "providerServices/";
  let img;
  if (!booking?.customerId.image) {
    img = `${API}/asset/noimage.png`;
  } else {
    img = `${API}/uploads/${imagePath}${booking?.customerId.image}`;
  }
  const bookingContent = (
    <div className="fixed inset-0 flex justify-center items-center bg-[#c8c6e459] backdrop-blur-sm bg-opacity-20 z-50  p-4">
      <div className="overflow-y-auto max-h-screen w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.15)] relative">
        {mode === "view" && setShowPopup && (
          <button
            onClick={setShowPopup}
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
          >
            ✖
          </button>
        )}

        <h2 className="text-2xl font-bold text-[#5A52A4] mb-6 text-center">
          Booking Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-[#f9f9fb] flex gap-4 items-start">
            {booking?.customerId?.profileImage && (
              <img
                src={booking.customerId.profileImage}
                alt="Customer"
                className="w-16 h-16 rounded-full object-cover border"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#7879CA]">
                Customer Information
              </h3>
              <p>
                <strong>Name:</strong> {booking?.customerId?.fullname}
              </p>
              <p>
                <strong>Customer ID:</strong> {booking?.customerId?._id}
              </p>
            </div>
          </div>

          {/* Worker Info */}
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-[#f9f9fb]">
            <h3 className="text-lg font-semibold mb-2 text-[#7879CA]">
              Worker Information
            </h3>
            <p>
              <strong>Worker ID:</strong> {booking?.workerId}
            </p>
          </div>

          {/* Service Info */}
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-[#f9f9fb]">
            <h3 className="text-lg font-semibold mb-2 text-[#7879CA]">
              Service Information
            </h3>
            <p>
              <strong>Service:</strong> {booking?.serviceId?.serviceName}
            </p>
            <p>
              <strong>Subcategory:</strong>{" "}
              {booking?.subcategoryId?.subcategory}
            </p>
          </div>

          {/* Payment & Booking Status */}
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-[#f9f9fb]">
            <h3 className="text-lg font-semibold mb-2 text-[#7879CA]">
              Status
            </h3>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  booking?.paymentStatus === "Paid"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {booking?.paymentStatus}
              </span>
            </p>
            <p>
              <strong>Booking Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  booking?.bookingStatus === "Completed"
                    ? "text-green-600"
                    : booking?.bookingStatus === "Pending"
                    ? "text-yellow-500"
                    : "text-blue-600"
                }`}
              >
                {booking?.bookingStatus}
              </span>
            </p>
          </div>

          {/* Time & Date Slot */}
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-[#f9f9fb]">
            <h3 className="text-lg font-semibold mb-2 text-[#7879CA]">
              Time & Date Slot
            </h3>
            <p>
              <strong>Date:</strong> {booking?.slot.date}
            </p>
            <p>
              <strong>Time Slot:</strong> {booking?.slot.time}
            </p>
          </div>

          {/* Address Info */}
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-[#f9f9fb]">
            <h3 className="text-lg font-semibold mb-2 text-[#7879CA]">
              Address Information
            </h3>
            <p>
              <strong>Address:</strong> {booking?.location}
            </p>
            <p>
              <strong>Customer Contact:</strong>{" "}
              {booking?.customerId?.phone ?? "N/A"}
            </p>
          </div>

          {/* Billing Details */}
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-[#f9f9fb]">
            <h3 className="text-lg font-semibold mb-2 text-[#7879CA]">
              Billing Details
            </h3>
            <p>
              <strong>Offer Price:</strong> ₹
              {booking?.amount.total - booking?.amount.offertValue ?? 0}
            </p>
            <p>
              <strong>Service Price:</strong> ₹{booking?.amount.total ?? 0}
            </p>
            <h3 className="text-lg font-semibold mt-2 mb-2 text-[#7879CA]">
              Total Paid
            </h3>
            <p>
              <strong>Advance Paid:</strong> ₹{booking?.amount.advancePaid ?? 0}
            </p>
            <p className="font-bold text-lg ">
              <strong>Reamining:</strong> ₹
              {booking?.amount.invoiceAmount - booking?.amount.advancePaid ?? 0}
            </p>
          </div>

          {/* Total Paid */}
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-[#f9f9fb] flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-2 text-[#7879CA]">
              Profile
            </h3>
            <img src={img}   className="w-32 h-32 object-cover rounded-full border mx-auto"
 />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return mode === "view" ? (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="text-lg font-semibold text-gray-600">
          Loading booking details...
        </div>
      </div>
    ) : (
      <div className="flex justify-center items-center h-96 text-lg font-semibold text-gray-600">
        Loading booking details...
      </div>
    );
  }

  if (!booking) {
    return mode === "view" ? (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="text-lg font-semibold text-red-500">
          Booking not found.
        </div>
      </div>
    ) : (
      <div className="flex justify-center items-center h-96 text-lg font-semibold text-red-500">
        Booking not found.
      </div>
    );
  }

  // Render based on mode
  if (mode === "view") {
    // Popup mode
    return (
      <div
        className="fixed inset-0 flex justify-center items-center bg-[#c8c6e459]  z-50"
      >
        {bookingContent}
      </div>
    );
  } else {
    // Full page mode
    return <ProviderLayout>{bookingContent}</ProviderLayout>;
  }
};

export default ViewBookingDetails;
