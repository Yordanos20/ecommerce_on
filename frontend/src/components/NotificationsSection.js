// frontend/src/components/NotificationsSection.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const NotificationsSection = () => {
  const { notifications, fetchNotifications, markNotificationRead } = useContext(AuthContext);
  const [localNotifications, setLocalNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setLocalNotifications(data);
  };

  const handleMarkRead = async (id) => {
    const success = await markNotificationRead(id);
    if (success) {
      setLocalNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
      );
    } else {
      toast.error("Failed to mark notification as read.");
    }
  };

  const unreadCount = localNotifications.filter(n => !n.is_read).length;

  return (
    <div className="dashboard-card p-4 space-y-2">
      <h2 className="text-lg font-bold flex items-center justify-between">
        Notifications
        {unreadCount > 0 && (
          <span className="text-sm text-white bg-red-500 rounded-full px-2 py-0.5">
            {unreadCount} New
          </span>
        )}
      </h2>

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No new notifications.</p>
        ) : (
          localNotifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              className={`p-2 rounded cursor-pointer flex justify-between items-start border ${
                n.is_read ? "bg-gray-100 border-gray-300" : "bg-blue-50 border-blue-200"
              } hover:shadow`}
            >
              <span className="text-sm">{n.message}</span>
              {!n.is_read && <span className="text-xs text-blue-600 font-bold">New</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsSection;