import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Orders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("🚀 Orders component mounted");
  console.log("🔑 Token available:", !!token);

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("🛒 Starting fetchOrders function...");
      console.log("🌐 Backend URL: https://ecommerce-backend-ol0h.onrender.com/api/orders/my-orders");
      
      try {
        console.log("� Attempting to fetch from backend...");
        
        // Try to fetch real orders from backend
        const res = await axios.get("https://ecommerce-backend-ol0h.onrender.com/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Backend response received:");
        console.log("📊 Response status:", res.status);
        console.log("📊 Response data:", res.data);
        console.log("📊 Orders count:", res.data?.length || 0);

        // Ensure total is available
        const ordersWithTotal = res.data.map(order => ({
          ...order,
          total: order.total ?? order.total_price,
          items: order.items ?? [],
        }));

        console.log("📋 Orders processed:", ordersWithTotal);
        setOrders(ordersWithTotal);
        console.log(" Orders state updated successfully");
        
      } catch (error) {
        console.error(" Backend fetch failed:", error);
        console.error(" Error details:", {
          status: error.response?.status,
          message: error.response?.data || error.message,
          url: "https://ecommerce-backend-ol0h.onrender.com/api/orders/my-orders"
        });
        
        // ONLY use mock data if backend is completely unavailable
        // Don't create sample orders - only show existing ones
        try {
          const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
          if (mockOrders.length > 0) {
            console.log(" Backend unavailable, using existing mock orders ONLY");
            console.log(" Mock orders found:", mockOrders);
            setOrders(mockOrders);
          } else {
            console.log(" No orders available - backend down and no mock orders");
            setOrders([]); // Empty state - no fake data
          }
        } catch (localStorageError) {
          console.error(" Critical localStorage error:", localStorageError);
          setOrders([]);
        }
      } finally {
        console.log(" FetchOrders function completed");
        setLoading(false);
      }
    };

    if (token) {
      console.log(" Token found, starting fetch...");
      fetchOrders();
    } else {
      console.log("❌ No token found - cannot fetch orders");
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div className="max-w-6xl mx-auto p-6"><p>Loading orders...</p></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-6">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v7" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M6 21v-4l-6-3m0 4V3l6 3m6-3v4l6-3m-6-3v4m6 3v4" />
              </svg>
              Browse Products
            </Link>
            
            <Link
              to="/cart"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M6 21v-4l-6-3m0 4V3l6 3m6-3v4l6-3m-6-3v4m6 3v4" />
              </svg>
              View Cart
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  Total: ${order.total}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {order.status}
                </p>
              </div>

              <Link
                to={`/customer/orders/${order.id}/track`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Track Order
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}