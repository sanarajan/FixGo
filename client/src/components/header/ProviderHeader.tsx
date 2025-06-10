import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import { logout } from "../../utils/LogoutHelper"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
const ProviderHeader: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
// const user = useSelector((state: RootState) => state.user.user);
// const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
 const user = useSelector((state: RootState) => state.provider.user);
  const isAuthenticated = useSelector((state: RootState) => state.provider.isAuthenticated);

  useEffect(() => {


    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfile = () => {
    console.log("Profile clicked");
    // Navigate to profile (use navigate if using React Router)
  };

const handleLogout = () => {
  logout("provider"); // Redirects to correct login
};

  return (
    <div className="bg-[#7879CA] h-14 flex items-center justify-between px-6 text-white relative">
      <h2 className="text-xl font-semibold"> {user?.fullname ?? "Loading user..."}</h2>
      <div className="flex items-center gap-4 relative">
        <FaBell className="cursor-pointer" />

        <div ref={dropdownRef} className="relative">
          <FaUser
            className="cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-5 w-48 rounded-xl p-1 border border-purple-700 bg-white shadow-lg z-50">
              <div className="space-y-2">
                <button
                  onClick={handleProfile}
                  className="w-full py-2 text-[#7879CA] text-center text-md font-semibold rounded-md bg-white hover:bg-gray-100 transition-all duration-200"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-[#5A52A4] text-center text-md font-semibold rounded-md bg-white hover:bg-gray-100 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderHeader;
