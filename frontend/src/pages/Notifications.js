// frontend/src/pages/Notifications.js
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);

  // Fetch notifications on load
  useEffect(() => {
    api.get("/notifications")
      .then((res) => setNotifs(Array.isArray(res.data) ? res.data : []))
      .catch(() => setNotifs([]));
  }, []);

  // Mark as read
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`); // ✅ Fixed: use PUT and correct path
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
      toast.success("Notification marked as read");
    } catch (e) {
      console.error(e);
      toast.error("Failed to mark as read");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      {notifs.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-2">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-lg border ${n.is_read ? "bg-gray-50" : "bg-yellow-50 border-yellow-200"
                }`}
            >
              <p className="text-gray-800">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
              </p>
              {!n.is_read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}