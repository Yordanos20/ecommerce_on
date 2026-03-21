// frontend/src/components/NotificationsDropdown.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function NotificationsDropdown() {
  const { notifications, fetchNotifications, markNotificationRead } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);

  useEffect(() => {
    if (open) loadNotifications();
  }, [open]);

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setLocalNotifications(data);
  };

  const handleMarkRead = async (id) => {
    const success = await markNotificationRead(id);
    if (success) {
      setLocalNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } else {
      toast.error("Failed to mark notification as read.");
    }
  };

  const unreadCount = localNotifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Notifications ({unreadCount})
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          {localNotifications.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No notifications</p>
          ) : (
            localNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b dark:border-gray-700 cursor-pointer flex justify-between items-start ${
                  n.is_read ? "bg-gray-100 dark:bg-gray-900" : "bg-blue-50 dark:bg-blue-800"
                }`}
                onClick={() => handleMarkRead(n.id)}
              >
                <span>{n.message}</span>
                {!n.is_read && <span className="text-xs text-blue-600 font-bold">New</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}