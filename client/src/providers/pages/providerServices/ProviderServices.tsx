import { useEffect, useState } from "react";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import TableList from "../../../components/tableList/TableList";
import axiosClient from "../../../api/axiosClient";
import { IproviderServices } from "../../../types/ProviderServices";
import AddProviderService from "../../../components/popups/providerService/AddProviderService";
import DeleteConfirmPopup from "../../../components/popups/tools/DeleteConfirmPopup";
import StatusConfirmPopup from "../../../components/popups/tools/StatusConfirmPopup";

interface providerProps {
  userType: string;
}
const ProviderServices = ({ userType }: providerProps) => {
  const [services, setServices] = useState<IproviderServices[]>([]);
  const [subcategories, setSubcategories] = useState<IproviderServices[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totCount, setTotCount] = useState(0);
  useEffect(() => {
    fetchServices();
  }, [page]);
  const refresh = () => fetchServices();
  const fetchServices = async () => {
    try {
      setBusy(true);
      const API = import.meta.env.VITE_API_URL;
      const response = await axiosClient.get(
        `/api/provider/providerServices?page=${page}&limit=3`,
        {
          headers: {
            userRole: userType,
          },
        }
      );
      console.log(response.data.services + " servic");
      setServices(response.data.services);
      setTotalPages(response.data.totalPages);
      setTotCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching users:", error);
      setServices([]);
    } finally {
      setBusy(false);
    }
  };
  const filteredUsers = services;
  if (searchTerm) {
    const filteredUsers = searchTerm
      ? services.filter((service) =>
          service.serviceId?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : services;
  }

  return (
    <ProviderLayout>
      <TableList
        data={filteredUsers}
        onSearch={setSearchTerm}
        page={page}
        setPage={setPage}
        pagesize={3}
        totalPages={totalPages}
        totCount={totCount}
        busy={busy}
        userType={userType}
        headings={[
          { key: "image", label: "Image", type: "image" },
          { key: "serviceId.serviceName", label: "Servicename" },
          { key: "subcategoryId.subcategory", label: "Subcategory" },
          { key: "status", label: "Status", type: "status" },
        ]}
        showSubcategory={false}
        showActions={["view", "edit", "delete", "blockUnblock"]}
        actionConfig={{
          add: { type: "popup", component: AddProviderService },
          edit: { type: "popup", component: AddProviderService },
          view: { type: "popup", component: AddProviderService },

          delete: {
            type: "popup",
            component: DeleteConfirmPopup,
            params: { api: "/api/provider/deleteProviderService" },
          },
          blockUnblock: {
            type: "popup",
            component: StatusConfirmPopup,
            params: { api: "/api/provider/providerServiceBlockUnblock" },
          },
        }}
        refresh={refresh}
        imagePath="providerServices/"
        
      />
    </ProviderLayout>
  );
};

export default ProviderServices;
