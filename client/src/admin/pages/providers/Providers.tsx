import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import TableList from "../../../components/tableList/TableList";
import adminAxiosClient from "../../../api/adminAxiosClient";
import { User } from "../../../types/User";
import AddEditService from "../../../components/popups/services/AddEditService";
import StatusConfirmPopup from "../../../components/popups/tools/StatusConfirmPopup";
import { useNavigate } from "react-router-dom";

interface providerProps {
  userType: string;
}
const Providers = ({ userType }: providerProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [busy, setBusy]             = useState(false);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totCount,setTotCount]      = useState(0);
const navigate = useNavigate()
  useEffect(() => {
    fetchUsers();
  }, [page]);
  const refresh = () => fetchUsers();  

  const fetchUsers = async () => {
    try {
      const response = await adminAxiosClient.get(`/api/admin/providers?page=${page}&limit=3`, {
        headers: {
          userRole: userType,
        },
      });

      setUsers(response.data.customers);
    setTotalPages(response.data.totalPages); 
    setTotCount(response.data.totalCount)
    } catch (error) {
      //  console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setBusy(false);
    }
  };
  const filteredUsers = users;
  if (searchTerm) {
    
    const filteredUsers = searchTerm
  ? users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : users;
  }
  const handleStaffClick = (providerId: string) => {
  navigate("/admin/ProvidersStaff", {
                        state: {
                          providerId
                        },
                      });
};
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
         imagePath="providerServices/"
        headings={[
          { key: "image", label: "Image", type: "image" },
          { key: "fullname", label: "Name" },
          { key: "username", label: "Username" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Mobile" },
          { key: "status", label: "Status", type: "status" },
          { key: "isStaffExist", label: "Staffs", type: "button" },       
         ]}
        showSubcategory={false}
        showActions={["view", "blockUnblock"]}
        actionConfig={{
          view: {
            type: "popup",
            component: AddEditService,
          },
          blockUnblock: {
            type: "popup",
            component: StatusConfirmPopup,
            params: { api: "/api/admin/blockUnblockProvider" },
          },
        }}
        refresh={refresh}
          handleStaffClick={handleStaffClick}
      />
    </AdminLayout>
  );
};

export default Providers;
