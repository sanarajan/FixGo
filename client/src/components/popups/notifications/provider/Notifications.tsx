import { useEffect, useRef } from "react";
import { INotification } from "../../../../interface/Notifications";
import socket from "../../../../utils/socket";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Added props for notifications from parent
interface Props {
  visible: boolean;
  onClose: () => void;
  notifications: INotification[];
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
}

const NotificationPopup: React.FC<Props> = ({
  visible,
  onClose,
  notifications,
  setNotifications,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  useEffect(() => {
    // ✅ Keep real-time updates via socket
    socket.on("staff_rejected", (data: INotification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("staff_rejected");
    };
  }, [setNotifications]);

  if (!visible) return null;
  return (
    <div
      ref={panelRef}
      className="absolute top-10 right-0 w-96 max-h-[500px] bg-white shadow-lg rounded-lg z-50 overflow-y-auto"
    >
      <div className="bg-[#7879CA] text-white px-4 py-2 rounded-t-lg text-lg font-semibold">
        Notifications
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No notifications yet
        </div>
      ) : (
        notifications.map((n, index) => (
          <div
            onClick={() => {
              if (n.type === "staff_rejected"&&n.isRead===false) {
                navigate(`/provider/rejectedStaff`, {
                  state: { rejected: true, staffId: n.rejectedStaff },
                });
              }else{
                toast.success("Staff already updated");
              }
            }}
            key={index}
            className="flex items-start px-4 py-3 border-b hover:bg-gray-100 transition cursor-pointer"
            // TODO: Add onClick to navigate later
          >
            <img
              src={"https://i.pravatar.cc/40?img=" + (index + 1)}
              className="w-10 h-10 rounded-full object-cover mr-3"
              alt="notification"
            />
            <div>
              <div className="font-semibold text-gray-600">
                {n.title ?? "Staff Notification"}
              </div>
              <div className="text-sm text-gray-600">
                {n.message
                  ? n.message.length > 35
                    ? n.message.slice(0, 35) + "..."
                    : n.message
                  : ""}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPopup;
