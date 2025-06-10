import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import TableList from "../../../components/tableList/TableList";
import axiosClient from "../../../api/axiosClient";
import { User } from "../../../types/User";
import AddEditService from "../../../components/popups/services/AddEditService";
import DeleteConfirmPopup from "../../../components/popups/tools/DeleteConfirmPopup";
import StatusConfirmPopup from "../../../components/popups/tools/StatusConfirmPopup";

interface providerProps {
  userType: string;
}
const Services = ({ userType }: providerProps) => {
  const [services, setServices] = useState<User[]>([]);
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
        `/api/admin/services?page=${page}&limit=3`,
        {
          headers: {
            userRole: userType,
          },
        }
      );
      setServices(response.data.services);
      setTotalPages(response.data.totalPages);
      setTotCount(response.data.totalCount);
    } catch (error) {
      // console.error('Error fetching users:', error);
      setServices([]);
    } finally {
      setBusy(false);
    }
  };
  const filteredUsers = services;
  if (searchTerm) {
    const filteredUsers = searchTerm
      ? services.filter((service) =>
          service.username?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : services;
  }

  return (
    <AdminLayout>
      <TableList
        data={filteredUsers}
        onSearch={setSearchTerm}
        page={page}
        setPage={setPage}
        pagesize={3}
        totalPages={totalPages}
        totCount={totCount}
        busy={busy}
        headings={[
          { key: "serviceName", label: "Servicename" },
          { key: "status", label: "Status", type: "status" },
        ]}
        showSubcategory={true}
        showActions={["view", "edit", "delete", "blockUnblock"]}
        actionConfig={{
          add: { type: "popup", component: AddEditService },
          edit: { type: "popup", component: AddEditService },
          view: { type: "popup", component: AddEditService },
          delete: {
            type: "popup",
            component: DeleteConfirmPopup,
            params: { api: "/api/admin/deleteService" },
          },
          blockUnblock: {
            type: "popup",
            component: StatusConfirmPopup,
            params: { api: "/api/admin/blockUnblock" },
          },
        }}
        refresh={refresh}
      />
    </AdminLayout>
  );
};

export default Services;
