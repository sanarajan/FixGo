import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import TableList from "../../../components/tableList/TableList";
import adminAxiosClient from "../../../api/adminAxiosClient";
import { User } from "../../../types/User";
import AddEditService from "../../../components/popups/services/AddEditService";
import StatusConfirmPopup from "../../../components/popups/tools/StatusConfirmPopup";
import VerifyUser from "../../../components/popups/staffs/verifyUser"
import { useLocation } from "react-router-dom";

interface providerProps {
  userType: string;
}
const ProvidersStaffs = ({ userType }: providerProps) => {
  const location = useLocation();
    const providerId = location.state.providerId;
  const [staffs, setStaffs] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [busy, setBusy]             = useState(false);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totCount,setTotCount]      = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]);
  const refresh = () => fetchUsers();  

  const fetchUsers = async () => {
    try {
      const response = await adminAxiosClient.get(`/api/admin/providersStaffs`,{
  params: {
    page,
    limit: 3,
    providerId, // your id value
  }},);
    setStaffs(response.data.customers); 

   setTotalPages(response.data.totalPages); 
    setTotCount(response.data.totalCount)
    console.log("filteredUsers", response.data); // ✅ This will now log properly

    } catch (error) {
      //  console.error('Error fetching users:', error);
      setStaffs([]);
    } finally {
      setBusy(false);
    }
  };
  const filteredUsers = staffs;
  if (searchTerm) {
    
 let filteredUsers = staffs;

if (searchTerm) {
  filteredUsers = staffs.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

console.log("last filer", staffs); // ✅ This will now log properly





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
         imagePath="providerServices/"
        headings={[
          { key: "image", label: "Image", type: "image" },
          { key: "fullname", label: "Name" },
          // { key: "username", label: "Username" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Mobile" },
          { key: "status", label: "Status", type: "status" },
           { key: "verified", label: "Verify", type: "verified" },
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
           verify: {
              type: "popup",
              component: VerifyUser,
              params: { api: "/api/admin/verifyStaff" },
            },
        }}
        refresh={refresh}
      />
    </AdminLayout>
  );
};

export default ProvidersStaffs;