import React from "react";
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaCogs,
  FaBox,
  FaMoneyBill,
  FaChartBar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";

type MenuItem = {
  label: string;
  icon: ReactNode;
  path: string;
};
const menuItems: MenuItem[] = [
  {
    label: "DASHBOARD",
    icon: <FaTachometerAlt />,
    path: "/provider/dashboard",
  },
  { label: "PROFILE", icon: <FaUser />, path: "/provider/profile" },
  // { label: 'PROVIDERS', icon: <FaUsers />, path: '/provider/providers' },
  { label: "CUSTOMERS", icon: <FaUsers />, path: "/provider/customers" },
  { label: "STAFFS", icon: <FaUsers />, path: "/provider/staffs" },
  { label: "SERVICES", icon: <FaCogs />, path: "/provider/services" },
  { label: "BOOKINGS", icon: <FaBox />, path: "/provider/bookings" },
  { label: "PAYMENTS", icon: <FaMoneyBill />, path: "/payments" },
  { label: "REPORT", icon: <FaChartBar />, path: "/report" },
];
interface AdminSidebarProps {
  onCollapse: () => void; //
}
const Sidebar: React.FC<AdminSidebarProps> = ({ onCollapse }) => {
  const storedUser = localStorage.getItem("provider_user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const user = useSelector((state: RootState) => state.provider.user);
  const imagePath = "providerServices/";
  const API = import.meta.env.VITE_API_URL;

  const imageURL = user?.image
    ? `${API}/uploads/${imagePath}${user.image}`
    : `${API}/asset/noimage.png`;
  return (
    <div className="p-3">
      {/* Outer grey curved container */}
      <div className="bg-[#f4f4f7] w-[245px] rounded-2xl shadow-[0_16px_32px_rgba(0,0,0,0.25),0_8px_12px_rgba(0,0,0,0.15),inset_0_2px_6px_rgba(255,255,255,0.35)] p-3">
        {/* Purple sidebar box */}
        <div className="bg-[#7D7EB3] w-full text-white min-h-screen flex flex-col items-center pb-10 rounded-xl shadow-[0_18px_36px_rgba(0,0,0,0.4),0_6px_12px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(255,255,255,0.25)] relative">
          {/* COLLAPSE BUTTON — TOP OF PURPLE BOX */}
          <div className="w-full flex justify-end px-3 pt-3">
            <button
              onClick={onCollapse}
              className="bg-[#9697BB] text-white px-2 py-1 rounded-full text-xs shadow hover:bg-[#b0b1d5]"
              title="Collapse Sidebar"
            >
              ⬅️
            </button>
          </div>

          {/* Profile section */}
          <div className="bg-[#9697BB] w-[170px] h-[150px] rounded-[41px] flex flex-col items-center justify-center shadow-[0_6px_12px_rgba(0,0,0,0.4)] mt-3">
            <img
              src={imageURL}
              alt="Profile"
              className="w-[100px] h-[100px] rounded-full object-cover shadow-md"
            />
          </div>

          <div className="mt-[-15px] px-4 py-1 bg-[#816AD8] rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_8px_rgba(0,0,0,0.3)] text-sm font-semibold">
            {user?.fullname}
          </div>

          {/* Sidebar menu */}
          <div className="mt-10 w-full flex flex-col space-y-[1px] px-0">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="bg-white w-full py-1 px-2 border border-[#988DC1] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]"
              >
                <Link
                  to={item.path}
                  className="w-full flex items-center gap-3 px-3 py-3 bg-[#7D7EB3] rounded-full text-left shadow-[0_12px_24px_rgba(0,0,0,0.5),0_4px_6px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-transform duration-150"
                >
                  <span className="ml-1">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex-grow" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
