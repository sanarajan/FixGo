import { useEffect, useState } from "react";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import BookingTableList from "../../../components/bookingTable/BookingTableList";
import axiosClient from "../../../api/axiosClient";
import ViewBookingDetails from "../../../components/popups/booking/ViewBookingDetails";
import DeleteConfirmPopup from "../../../components/popups/tools/DeleteConfirmPopup";
import StatusConfirmPopup from "../../../components/popups/tools/StatusConfirmPopup";
import { IOrder } from "./OrderInterface";
import BookingStatusUpdatePopup from "../../../components/popups/bookingStatus/BookingStatusUpdatePopup";
interface CustomersProps {
  userType: string;
}

const Bookings = ({ userType }: CustomersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totCount, setTotCount] = useState(0);
  const [bookings, setBookings] = useState<IOrder[]>([]);

  useEffect(() => {
    fetchBooking();
  }, [page]);

  const refresh = () => fetchBooking();

  const fetchBooking = async () => {
    try {
      setBusy(true);
      const API = import.meta.env.VITE_API_URL;
      const response = await axiosClient.get(
        `/api/provider/bookingList?page=${page}&limit=10`
      );

      setTotalPages(response.data.totalPages);
      setTotCount(response.data.totalCount);
      setBookings(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setBusy(false);
    }
  };

  const filteredUsers = searchTerm
    ? bookings.filter((bookng) =>
        bookng.customerId.fullname
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : bookings;

  return (
    <ProviderLayout>
      <BookingTableList
        data={filteredUsers}
        onSearch={setSearchTerm}
        page={page}
        setPage={setPage}
        pagesize={10}
        totalPages={totalPages}
        totCount={totCount}
        busy={busy}
        refresh={refresh}
        imagePath="providerServices/"
        headings={[
          { key: "customerId.fullname", label: "Customer" },
          { key: "customerId.phone", label: "Phone" }, // just display string workerId
          { key: "customerId.email", label: "Email" },
          { key: "serviceId.serviceName", label: "Service" },
          { key: "subcategoryId.subcategory", label: "Subcategory" },
          { key: "paymentStatus", label: "Pay Status", type: "paymentStatus" },
          { key: "bookingStatus", label: "Book Status", type: "updateStatus" },
          { key: "bookingAddress", label: "Address" },
        ]}
        showSubcategory={false}
        showActions={["view",  "blockUnblock", "updateStatus"]}
        actionConfig={{
          view: { type: "popup", component: ViewBookingDetails },
          updateStatus: { type: "popup", component: BookingStatusUpdatePopup },
        }}
      />
    </ProviderLayout>
  );
};

export default Bookings;
