// src/components/OrdersSection.js
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function OrdersSection() {
  const { user, fetchOrders } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.id]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3">#{order.id}</td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td>${order.total_price || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
