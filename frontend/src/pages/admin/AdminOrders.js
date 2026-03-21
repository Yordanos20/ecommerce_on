import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const processedOrders = res.data.map(order => ({
        id: order.id,
        customerName: order.customer_name || 'Unknown Customer',
        customerEmail: order.customer_email || 'N/A',
        total: parseFloat(order.total_price) || 0,
        status: order.status || 'Pending',
        date: new Date(order.created_at).toISOString().split('T')[0],
        items: order.items || []
      }));
      
      setOrders(processedOrders);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/admin/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">#{o.id}</td>
                <td className="p-3">{o.customer_name}</td>
                <td className="p-3">${Number(o.total_price || 0).toFixed(2)}</td>
                <td className="p-3">
                  <select
                    className="border p-1 rounded"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
