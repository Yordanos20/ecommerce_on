// frontend/src/pages/seller/SellerNotifications.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function SellerNotifications() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      try {
        const res = await axios.get("/api/seller/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove duplicate notifications by ID
        const uniqueNotifications = Array.from(
          new Map(res.data.map((n) => [n.id, n])).values()
        );

        // Sort notifications by date descending (most recent first)
        uniqueNotifications.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setNotifications(uniqueNotifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">You have no notifications at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="border rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-800 transition"
            >
              <p className="font-medium">{n.title || "Notification"}</p>
              <p className="text-gray-600 dark:text-gray-300">{n.message}</p>
              {n.created_at && (
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}