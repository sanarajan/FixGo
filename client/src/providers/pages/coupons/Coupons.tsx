import { useEffect, useState } from "react";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import TableList from "../../../components/tableList/TableList";
import axiosClient from "../../../api/axiosClient";
import {OfferRow} from "../../../interface/OfferRow";
import StatusConfirmPopup from "../../../components/popups/tools/StatusConfirmPopup";
import ViewOfferPopup from "../offers/ViewOffer";

interface CustomersProps {
  userType: string;
}

const Offers = ({ userType }: CustomersProps) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totCount, setTotCount] = useState(0);

  useEffect(() => {
    fetchOffers();
  }, [page]);

  const refresh = () => fetchOffers();

  const fetchOffers = async () => {
    setBusy(true);
    try {
      const response = await axiosClient.get(
        `/api/provider/offerList?page=${page}&limit=5`,
        {
          headers: {
            userRole: userType,
          },
        }
      );
      setOffers(response.data.offers);
      setTotalPages(response.data.totalPages);
      setTotCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setOffers([]);
    } finally {
      setBusy(false);
    }
  };

  // Optional filtering
  const filteredOffers = offers.filter((offer) => {
    const service = offer?.serviceId?.serviceName || "";
    const subcategory = offer?.subcategoryId?.subcategory || "";
    return (
      service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  return (
    <ProviderLayout>
     <TableList<OfferRow>
  data={filteredOffers}
  onSearch={setSearchTerm}
  page={page}
  setPage={setPage}
  pagesize={5}
  totalPages={totalPages}
  totCount={totCount}
  busy={busy}
  refresh={refresh}
  imagePath="providerServices/"
  headings={[
    { key: "providerServiceId.image", label: "Image", type: "image" },
     { key: "offerName", label: "Name", type: "text" },
    {
      
      key: "serviceId.serviceName",
      label: "Service / Subcategory",
      format: (row: OfferRow) =>
        row.offerFor === "subcategory"
          ? `${row.serviceId?.serviceName} / ${row.subcategoryId?.subcategory}`
          : row.serviceId?.serviceName,
    },
    {
      key: "offerValue",
      label: "Offer",
      format: (row: OfferRow) =>
        row.offerType === "percentage"
          ? `${row.offerValue}%`
          : `₹${row.offerValue}`,
    },
    { key: "startDate", label: "Start Date", type: "date", 
      format: (row: OfferRow) =>
        row.startDate
          ? `${row.startDate.split("T")[0]}`
          : `` },
    { key: "endDate", label: "End Date", type: "date",
       format: (row: OfferRow) =>
        row.endDate
          ? `${row.endDate.split("T")[0]}`
          : ``
     },
   {
  key: "status",
  label: "Status",
  type: "status",
  format: (row: OfferRow) => {
    const { status, startDate, endDate } = row;

    if (status !== "Active") return "Inactive";

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    const isInRange = now >= start && now <= end;

    return isInRange ? "Active" : "Inactive";
  },
}
,
  ]}
  showSubcategory={false}
  showActions={["add","view", "edit", "blockUnblock"]}
  actionConfig={{
    add: { type: "page", path: "/provider/addCoupon" },
    edit: { type: "page", path: "/provider/addCoupon" },
    view: {
      type: "popup",
      component: ViewOfferPopup,
    },
     blockUnblock: {
            type: "popup",
            component: StatusConfirmPopup,
            params: { api: "/api/provider/offerBlockUnblock" },
          },
  }}
/>
    </ProviderLayout>
  );
};

export default Offers;
