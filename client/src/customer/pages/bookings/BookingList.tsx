import React, { useEffect, useState } from "react";
import CustomerLayoutWithSidebar from "../../../components/customerLayout/CustomerLayoutWithSidebar";
import { MdDateRange, MdAccessTime, MdPayment, MdPerson } from "react-icons/md";
import { IOrder } from "../../../providers/pages/bookings/OrderInterface";
import customerAxiosClient from "../../../api/customerAxiosClient";
import EnhancedPagination from "../../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { getStatusStyle } from "../../../utils/StatusHelper";
const BookingList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [totCount, setTotCount] = useState(0);
  const [bookings, setBookings] = useState<IOrder[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchBooking();
  }, [page]);
  const fetchBooking = async () => {
    try {
      // setBusy(true);
      const API = import.meta.env.VITE_API_URL;
      const response = await customerAxiosClient.get(
        `/api/bookingList?page=${page}&limit=10`
      );

      setTotalPages(response.data.totalPages);
      setTotCount(response.data.totalCount);
      setBookings(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      // setBusy(false);
    }
  };
  console.log(JSON.stringify(bookings, null, 2) + " in list");
  const API = import.meta.env.VITE_API_URL;

  const imagePath = "providerServices/";
  let imageURL = "";

  imageURL = `${API}/uploads/${imagePath}`;
  let noimg = "noimage.png";
  return (
    <CustomerLayoutWithSidebar>
      <div className="p-6 bg-[#F9F9FB] min-h-screen font-sans">
        {/* Filter Dropdown */}
        <div className="flex gap-2 mb-6">
          {["ALL", "PENDING", "ACCEPTED", "COMPLETED"].map((status) => (
            <button
              key={status}
              className="px-4 py-2 rounded-md bg-white text-[#5A52A4] font-semibold shadow hover:bg-[#f0f0ff] transition"
            >
              {status}
            </button>
          ))}
        </div>
        {/* <div className="bg-white shadow rounded-xl p-4 mb-6">
          <select className="w-full p-3 rounded-md border border-gray-300 shadow focus:outline-none text-[#5A52A4] font-semibold text-md">
            <option>PENDING</option>
            <option>ACCEPTED</option>
            <option>COMPLETED</option>
          </select>
        </div> */}

        {/* Booking List Box */}
        <div className="bg-[#7D7EB3] rounded-2xl p-6 shadow-lg text-white">
          <h2 className="text-xl font-semibold mb-5 tracking-wide">
            YOUR BOOKINGS
          </h2>
          {bookings.length === 0 ? (
            <p className="text-center text-white">No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <div
                onClick={() => {
                  navigate("/bookingDetails", {
                    state: {
                      booking,
                    },
                  });
                }}
                key={booking._id} // Mongoose usually returns `_id`
                className="bg-white text-[#333] rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 ease-in-out border border-gray-100 flex flex-col md:flex-row gap-5 p-5 mb-6 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="bg-[#F3F4F6] p-2 rounded-lg flex items-center justify-center">
                  <img
                    src={
                      booking.providerServiceId?.image
                        ? imageURL + booking.providerServiceId.image
                        : "https://via.placeholder.com/120x100?text=Booking"
                    }
                    alt={booking.providerServiceId?.image || "Service"}
                    className="w-[120px] h-[100px] object-cover rounded-md"
                  />
                </div>

                {/* Booking Info */}
                <div className="flex flex-col md:flex-row justify-between w-full px-4">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold uppercase text-[#5A52A4]">
                      {booking.serviceId?.serviceName || "Service Name"}
                    </h3>
                    <h6 className="text-md  uppercase text-[#5A52A4]">
                      {booking.subcategoryId?.subcategory || "Service Name"}
                    </h6>
                    <div className="text-[#2c2c2c] font-semibold">
                      ₹{(booking.amount.invoiceAmount || 0).toFixed(2)}{" "}
                      <span className="text-green-600 text-sm font-medium">
                        ({booking.amount.offerValue || "0" }{booking.amount.offerType === "percentage" ? "%" : "₹"} ) off
                      </span>
                       <span className="ms-2 text-sm text-gray-500 line-through">₹{booking.amount.total}</span>
                    </div>
                  </div>

                  <div className="flex-1 text-sm text-[#5A52A4] leading-6">
                    <p className="font-medium">NO OF DAYS: 1 DAY </p>
                    <p className="flex items-center gap-1">
                      <MdDateRange /> DATE:{" "}
                      {booking.slot.date.toString().split("T")[0]}
                    </p>
                    <p className="flex items-center gap-1">
                      <MdAccessTime /> TIME: {booking.slot.time}
                    </p>
                    <p>
                      <MdPerson className="inline" /> PROVIDER:{" "}
                      {booking.providerId?.fullname || "N/A"}
                    </p>
                    <p>
                    
                      <MdPayment className="inline" /> PAYMENT: ₹
                      {booking.amount.advancePaid
                       }
                    </p>
                  </div>

                  <div className="text-sm text-right flex flex-col justify-between items-end">
                    <div>
                      {/* <p className="text-gray-500">{booking.bookingDate}</p> */}
                      <p className="text-gray-600 font-medium">
                        BOOKING ID: #{booking._id?.slice(-6).toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`mt-2 px-4 py-[6px] rounded-full text-sm font-semibold capitalize text-white transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md  ${getStatusStyle(
                        booking.bookingStatus || "Pending" // fallback if status is undefined
                      )}`}
                    >
                      {(booking.bookingStatus || "Pending").toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            )) // your existing render code
          )}
          {}

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <EnhancedPagination
              count={totalPages}
              page={page}
              totCount={totCount}
              pageSize={pageSize}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="medium"
            />
          </div>
        </div>
      </div>
    </CustomerLayoutWithSidebar>
  );
};

export default BookingList;
