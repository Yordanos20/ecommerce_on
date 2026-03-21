import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function MyOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersWithItems = res.data.map(order => ({
          ...order,
          total: order.total ?? order.total_price,
          items: order.items ?? [],
        }));

        setOrders(ordersWithItems);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!token) return <p className="p-6 text-center">Please login to view orders.</p>;
  if (loading) return <p className="p-6 text-center">Loading orders...</p>;
  if (orders.length === 0) return <p className="p-6 text-center">No orders found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded mb-4 shadow-sm bg-gray-50">
          <p className="font-semibold">Order ID: {order.id}</p>
          <p>Status: <span className="capitalize">{order.status}</span></p>
          <p>Total: ${order.total}</p>
          <p>Shipping: {order.city || "N/A"}, {order.state || "N/A"}, {order.zip || "N/A"}</p>
          <p>Placed on: {new Date(order.created_at).toLocaleString()}</p>

          <div className="mt-2">
            <h4 className="font-semibold">Items:</h4>
            {order.items.length > 0 ? (
              <ul className="list-disc pl-5">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - Quantity: {item.quantity}, Price: ${item.price}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items found.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}