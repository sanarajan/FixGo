import { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import TableList from "../../../components/tableList/TableList";
import axiosClient from "../../../api/axiosClient";
import { User } from "../../../types/User";
import DeleteConfirmPopup from "../../../components/popups/tools/DeleteConfirmPopup";
import StatusConfirmPopup from "../../../components/popups/tools/StatusConfirmPopup";
import AddEditServiceSubCategory from "../../../components/popups/subcategoryService/AddEditServiceSubCategory";

interface providerProps {
  userType: string;
}
const ServiceSubcategories = ({ userType }: providerProps) => {
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
        `/api/admin/servicesSubcategories?page=${page}&limit=3`,
        {
          headers: {
            userRole: userType,
          },
        }
      );
      console.log(response.data.services + "  service dta");
      setServices(response.data.services);
      setTotalPages(response.data.totalPages);
      console.log(response.data.totalPages + "  total page dta");

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
    const filteredUsers = useMemo(() => {
      return searchTerm
        ? services.filter((service) =>
            service.username?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : services;
    }, [searchTerm, services]);
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
          { key: "serviceId.serviceName", label: "Servicename" },
          { key: "subcategory", label: "Subcategory" },
          { key: "status", label: "Status", type: "status" },
        ]}
        showSubcategory={false}
        showActions={["view", "edit", "delete", "blockUnblock"]}
        actionConfig={{
          add: { type: "popup", component: AddEditServiceSubCategory },
          edit: { type: "popup", component: AddEditServiceSubCategory },
          view: { type: "popup", component: AddEditServiceSubCategory },

          delete: {
            type: "popup",
            component: DeleteConfirmPopup,
            params: { api: "/api/admin/deleteSubcategory" },
          },
          blockUnblock: {
            type: "popup",
            component: StatusConfirmPopup,
            params: { api: "/api/admin/subcategoryBlock" },
          },
        }}
        refresh={refresh}
      />
    </AdminLayout>
  );
};

export default ServiceSubcategories;
