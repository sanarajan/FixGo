import React, { useState } from "react";
import CustomerLayoutWithSidebar from "../../../components/customerLayout/CustomerLayoutWithSidebar";
import { useLocation } from "react-router-dom";
import { IOrder } from "../../../interface/OrderInterface";
import { getStatusStyle } from "../../../utils/StatusHelper";

const BookingDetails = () => {
  const location = useLocation();
  const bookingDetail = location.state.booking;
  const [bookings, setBooking] = useState<IOrder>(bookingDetail);
  const imagePath = "providerServices/";
  let imageURL = "";
  const API = import.meta.env.VITE_API_URL;

  imageURL = `${API}/uploads/${imagePath}`;
  let noimg = "noimage.png";

  return (
    <CustomerLayoutWithSidebar>
      <div className="bg-[#6060B8] min-h-screen p-6">
        {/* Booking ID */}
        <div className="mb-4">
          <span className="bg-white text-[#6060B8] font-semibold px-4 py-1 rounded-full shadow">
            BOOKING ID: {bookings?.workerId}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="md:flex gap-6">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              {/* Booking Details Card */}
              <div className="bg-[#ECEBF2] p-3 rounded-xl shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-all">
                <div className="bg-white p-4 rounded-xl">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="font-semibold uppercase">
                        {bookings?.serviceId?.serviceName || "Service"}
                      </h2>
                      <p className="text-sm mt-2">
                        <strong>DATE:</strong>{" "}
                        {new Date(bookings?.slot?.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <strong>TIME:</strong> {bookings?.slot?.time}
                      </p>
                      <p className="text-sm">
                        <strong>SUBCATEGORY:</strong>{" "}
                        {bookings?.subcategoryId?.subcategory}
                      </p>
                      <p className="text-sm">
                        <strong>LOCATION:</strong> {bookings?.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <img
                        src={
                          bookings.providerServiceId?.image
                            ? imageURL + bookings.providerServiceId.image
                            : "https://via.placeholder.com/120x100?text=Booking"
                        }
                        alt="Service"
                        className="w-32 h-20 rounded-md object-cover"
                      />
                      <span
                        className={` text-white text-xs px-3 py-1 rounded-full mt-2 ${getStatusStyle(
                          bookings.bookingStatus || "Pending" // fallback if status is undefined
                        )}`}
                      >
                        {bookings?.bookingStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Houseman (Customer Info) */}
              <div className="bg-[#ECEBF2] p-3 rounded-xl shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-all">
                <div className="bg-white p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-4 uppercase">
                    About Customer
                  </h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        bookings.providerServiceId?.image
                          ? imageURL + bookings.customerId.image
                          : "https://via.placeholder.com/120x100?text=Booking"
                      }
                      alt="Customer"
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#6060B8]">
                        {bookings?.customerId?.fullname}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {bookings?.customerId?.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bookings?.customerId?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Provider */}
              <div className="bg-[#ECEBF2] p-3 rounded-xl shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-all">
                <div className="bg-white p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-4 uppercase">
                    About Provider
                  </h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        bookings.providerServiceId?.image
                          ? imageURL + bookings.providerId?.image
                          : imageURL + noimg
                      }
                      alt="Provider"
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-[#6060B8]">
                          {bookings?.providerId?.fullname}
                        </h4>
                        <span className="text-green-500 text-xl">✔️</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {bookings?.providerId?.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bookings?.providerId?.phone}
                      </p>
                      <div className="mt-4 flex gap-3">
                        <button className="flex-1 bg-[#6060B8] text-white py-2 rounded-full shadow hover:bg-[#4a4aad] transition-all">
                          📞 Call
                        </button>
                        <button className="flex-1 border border-[#6060B8] text-[#6060B8] bg-white py-2 rounded-full hover:bg-[#f0f0ff] transition-all">
                          💬 Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/3 space-y-6 mt-6 md:mt-0">
              {/* Price Details */}
              <div className="bg-[#ECEBF2] p-3 rounded-xl shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-all">
                <div className="bg-white p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Price Details
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Price</span>
                      <span>₹{bookings?.amount?.invoiceAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sub Total</span>
                      <span>₹{bookings?.amount?.total}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({bookings?.amount?.offertYype})</span>
                      <span>-₹{bookings?.amount?.discount}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Advance Paid</span>
                      <span>₹{bookings?.amount?.advancePaid}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#6060B8] border-t pt-2">
                      <span>Total Amount</span>
                      <span>₹{bookings?.amount?.remaining}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment Status</span>
                      <span className="text-red-600">
                        {bookings?.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancel Booking */}
              <button className="w-full bg-[#6060B8] text-white py-2 rounded-full shadow hover:bg-[#4a4aad] transition-all duration-300 hover:scale-105">
                Cancel Booking
              </button>

              {/* Reviews - Static Sample */}
              <div className="bg-[#ECEBF2] p-3 rounded-xl shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-all">
                <div className="bg-white p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-3">Reviews</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <img
                          src="/reviewer.jpg"
                          className="w-10 h-10 rounded-full"
                          alt="Reviewer"
                        />
                        <div>
                          <p className="font-semibold text-sm">
                            Donna Bins{" "}
                            <span className="text-xs text-gray-400">
                              02 Dec
                            </span>
                          </p>
                          <p className="text-yellow-500 text-xs">
                            ⭐⭐⭐⭐⭐ 4.3
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Amet minim mollit non deserunt ullamco est sit aliqua
                        dolor do amet.
                      </p>
                    </div>

                    <button className="w-full text-[#6060B8] text-sm font-semibold mt-2">
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayoutWithSidebar>
  );
};

export default BookingDetails;
