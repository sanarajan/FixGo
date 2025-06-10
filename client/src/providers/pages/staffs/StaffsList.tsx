import { useEffect, useState } from "react";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import TableList from "../../../components/tableList/TableList";
import axiosClient from "../../../api/axiosClient";
import { User } from "../../../types/User";
import StaffView from "../../../components/popups/staffs/StaffView";
import DeleteConfirmPopup from "../../../components/popups/tools/DeleteConfirmPopup";
import StatusConfirmPopup from "../../../components/popups/tools/StatusConfirmPopup";

interface CustomersProps {
  userType: string;
}

const StaffsList = ({ userType }: CustomersProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totCount, setTotCount] = useState(0);
  useEffect(() => {
    fetchUsers();
  }, [page]);
  const refresh = () => fetchUsers();
  const fetchUsers = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const response = await axiosClient.get(
        `/api/provider/staffList?page=${page}&limit=3`,
        {
          headers: {
            userRole: userType,
          },
        }
      );
      setUsers(response.data.staffs);

      setTotalPages(response.data.totalPages);
      setTotCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setBusy(false);
    }
  };
  const filteredUsers = users;
  if (searchTerm) {
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
        refresh={refresh}
        imagePath="providerServices/"
        headings={[
          { key: "image", label: "Image", type: "image" },
          { key: "fullname", label: "Name" },
          { key: "username", label: "Username" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Mobile" },
          { key: "status", label: "Status", type: "status" },
          //   { key: 'companyName', label: 'Location' },
        ]}
        showSubcategory={false}
        showActions={["view", "edit", "blockUnblock"]}
        actionConfig={{
          add: { type: "page", path: "/provider/addStaff" },
          edit: { type: "page", path: "/provider/editStaff" },
          view: { type: "popup", component: StaffView },

          // delete: {
          //   type: "popup",
          //   component: DeleteConfirmPopup,
          //   params: { api: "/api/provider/deleteStaff" },
          // },
          blockUnblock: {
            type: "popup",
            component: StatusConfirmPopup,
            params: { api: "/api/provider/staffBlockUnblock" },
          },
        }}
      />
    </ProviderLayout>
  );
};

export default StaffsList;
