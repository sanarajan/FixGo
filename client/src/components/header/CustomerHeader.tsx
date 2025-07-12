import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { logout } from "../../utils/LogoutHelper";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const CustomerHeader: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const imageURL = `${API}/asset/saloon.webp`;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfile = () => {
    navigate("/profile"); // Assuming you have a Navigate function or useNavigate hook
    // Navigate to profile page, example: navigate('/profile');
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout("customer"); // Redirects to correct login // This version takes no argument
    setDropdownOpen(false);
  };
 

  const handleNotificationClick = () => {
    setNotificationCount(0);
    navigate("/notifications", { state: { notifications } }); // Or use Redux/store
  };
  return (
    <div className=" bg-white font-sans">
      {/* Header */}
      <header className="flex flex-wrap bg-[#7879CA] items-center justify-between px-4 md:px-8 py-4 shadow-md">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="text-2xl font-bold text-white">
            <span className="bg-black text-white px-2 py-1 rounded">FG</span>{" "}
            {/* {user?.fullname ?? "Loading user..."} */}
            FixGo
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xl text-white mt-4 md:mt-0">
          <span className="cursor-pointer" onClick={handleNotificationClick}>
            📋
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </span>

          <span className="cursor-pointer relative">🛒
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
          </span>
          <span className="cursor-pointer relative" onClick={toggleDropdown}>
            👤
            {dropdownOpen && (
              <div className="absolute right-0 mt-5 w-48 rounded-xl border-2 border-purple-500 bg-white shadow-2xl z-50 p-3 flex flex-col space-y-2">
                <button
                  onClick={handleProfile}
                  className="w-full py-2 text-[#5A52A4] text-center text-sm font-bold rounded-md bg-white shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:bg-gray-100 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-[#5A52A4] text-center text-sm font-bold rounded-md bg-white shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:bg-gray-100 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </span>
        </div>
      </header>
    </div>
  );
};

export default CustomerHeader;
