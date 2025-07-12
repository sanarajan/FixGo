import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import { logout } from "../../utils/LogoutHelper";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import socket from "../../utils/socket";
import { ToastContainer, toast } from "react-toastify";
import { INotification } from "../../interface/Notifications";
import axiosClient from "../../api/axiosClient";
import NotificationPopup from "../../components/popups/notifications/provider/Notifications";

const ProviderHeader: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  //for notification popup
  const [notificationOpen, setNotificationOpen] = useState(false);

  const user = useSelector((state: RootState) => state.provider.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.provider.isAuthenticated
  );
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [staffData, setStaffData] = useState<INotification | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
  useEffect(() => {
    const setup = async () => {
      const id = await fetchNotification(); // fetch + set notification + get providerId
      if (id) {
        initializeSocket(id); // Pass the providerId directly
      }
    };

    setup();

    return () => {
      socket.off("connect");
      socket.off("staff_rejected");
      socket.disconnect();
      console.log("🔌 Socket disconnected");
    };
  }, [notificationCount, providerId]);

  const initializeSocket = (id: string) => {
    socket.auth = { userId: id };
    socket.connect();

    console.log("📤 [SIMULATED CLIENT] Sent 'register' with userId:", id);
    socket.off("staff_rejected");
    socket.on("connect", () => {
      console.log("✅ [SIMULATED CLIENT] Connected as:", socket.id);
      socket.emit("registerUser", id);
    });

    socket.on("staff_rejected", (data: any) => {
      console.log("📥 Received staff_rejected:", data);
      toast.error(`${data.title}: ${data.reason}`);
      setNotificationCount((prev) => prev + 1);
      setNotifications((prev) =>
        Array.isArray(prev) ? [...prev, data] : [data]
      );
      setStaffData(data.data);

      // ✅ Dispatch global custom event
      window.dispatchEvent(new CustomEvent("staffRejected"));
    });
  };


  // useEffect(() => {
  //   fetchNotification();
  // }, []);
  const fetchNotification = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const response = await axiosClient.get(
        `${API}/api/provider/notifications`
      );
      if (!response.status) {
        throw new Error("Failed to fetch notifications");
      } else if (response.status === 200) {
        const data = await response.data;
        setNotifications(data.notifications);
        // setNotificationCount(data.totalCount);
        setProviderId(data.adminId);
        return data.adminId; // Return the providerId
      }
      // setNotificationCount(data.notifications.filter((n: INotification) => !n.isRead).length);
    } catch (error) {}
  };
  return (
    <div className="bg-[#7879CA] h-14 flex items-center justify-between px-6 text-white relative">
      <h2 className="text-xl font-semibold">
        {" "}
        {user?.fullname ?? "Loading user..."}
      </h2>
      <div className="flex items-center gap-4 relative">
        <ToastContainer position="top-center" autoClose={3000} />

        <div className="relative cursor-pointer">
          <FaBell
            className="text-xl"
            onClick={() => {
              
               setNotificationOpen((prev) => !prev);
            }}
          />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
{notificationOpen && (
          <NotificationPopup
            visible={notificationOpen}
           onClose={() => setNotificationOpen((prev) => !prev)}
            notifications={notifications} 
            setNotifications={setNotifications} 
          />
)}
        </div>

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
