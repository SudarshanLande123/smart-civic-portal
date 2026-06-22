import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationService";
import { getSocket } from "../../services/socket";

const NotificationBell = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Initial unread count on mount
  useEffect(() => {
    loadUnreadCount();
  }, []);

  // Listen for real-time updates. The socket itself is connected/managed
  // by SocketManager — this just attaches a listener to whatever socket
  // instance currently exists, retrying briefly if it isn't ready yet.
  useEffect(() => {
    let socket = getSocket();
    let retryTimer;

    const attachListener = () => {
      socket = getSocket();
      if (!socket) {
        retryTimer = setTimeout(attachListener, 500);
        return;
      }

      socket.on("complaintStatusUpdated", (payload) => {
        setUnreadCount((prev) => prev + 1);
        toast.success(payload.message || "Complaint status updated");

        setNotifications((prev) => [
          {
            _id: `temp-${Date.now()}`,
            title: "Complaint Status Updated",
            message: payload.message,
            complaintId: payload.complaintId,
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      });
    };

    attachListener();

    return () => {
      clearTimeout(retryTimer);
      socket?.off("complaintStatusUpdated");
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      loadNotifications();
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.log(error);
      }
    }

    setIsOpen(false);

    if (notification.complaintId) {
      const id =
        typeof notification.complaintId === "object"
          ? notification.complaintId._id
          : notification.complaintId;
      navigate(`/complaints/${id}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-lg border z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 p-4 text-center"><Loader/></p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-400 p-4 text-center">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition flex items-start justify-between gap-2 ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, notification._id)}
                  className="text-gray-300 hover:text-red-500 text-xs shrink-0"
                  aria-label="Delete notification"
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;