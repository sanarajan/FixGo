import { useEffect, useState } from "react";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import TableList from "../../../components/tableList/TableList";
import axiosClient from "../../../api/axiosClient";
import { CouponFormData } from "../../../interface/CouponInterface";
import StatusConfirmPopup from "../../../components/popups/tools/StatusConfirmPopup";
import ViewOfferPopup from "../offers/ViewOffer";

interface CustomersProps {
  userType: string;
}

const Offers = ({ userType }: CustomersProps) => {
  const [coupons, setCoupons] = useState<any[]>([]);
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
        `/api/provider/couponList?page=${page}&limit=5`,
        {
          headers: {
            userRole: userType,
          },
        }
      );
      setCoupons(response.data.coupons);
      setTotalPages(response.data.totalPages);
      setTotCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setCoupons([]);
    } finally {
      setBusy(false);
    }
  };

  // Optional filtering
    const filterCoupons = coupons;

   if (searchTerm) {
    const filterCoupons = coupons.filter((coupon) =>
      coupon.couponName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  return (
    <ProviderLayout>
      <TableList<CouponFormData>
        data={filterCoupons}
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
  { key: "couponImage", label: "Image", type: "image" },
  { key: "couponName", label: "Coupon Name", type: "text" },
  {
    key: "startDate",
    label: "Start Date",
    type: "date",
    format: (row: CouponFormData) =>
      row.startDate ? `${row.startDate.split("T")[0]}` : ``,
  },
  {
    key: "endDate",
    label: "End Date",
    type: "date",
    format: (row: CouponFormData) =>
      row.endDate ? `${row.endDate.split("T")[0]}` : ``,
  },
  { key: "minPurchase", label: "Minimum Purchase", type: "text" },
  { key: "discountType", label: "Type", type: "text" },
  {
    key: "discountValue",
    label: "Value",
    type: "text",
    format: (row: CouponFormData) => {
      return row.discountType === "percentage"
        ? `${row.discountPercentage}%`
        : `₹${row.discountValue}`;
    },
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    format: (row: CouponFormData) => {
      const { status, startDate, endDate } = row;

      if (status !== "Active") return "Inactive";

      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      return now >= start && now <= end ? "Active" : "Inactive";
    },
  },
]}

        showSubcategory={false}
        showActions={["add", "view", "edit", "blockUnblock"]}
        actionConfig={{
          add: { type: "page", path: "/provider/addCoupon" },
          edit: { type: "page", path: "/provider/EditCoupon" },
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
