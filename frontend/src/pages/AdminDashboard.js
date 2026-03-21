import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard({ darkMode, setDarkMode }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token found:", token ? "Yes" : "No");
      
      if (!token) {
        console.error("No token found in localStorage");
        toast.error("You must be logged in as admin");
        return;
      }

      console.log("Making API call to /api/admin/dashboard");
      const res = await axios.get("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Dashboard data received:", res.data);
      console.log("System info:", res.data.system);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        // Redirect to login
        window.location.href = "/admin/login";
      } else if (err.response?.status === 403) {
        toast.error("Access denied. Admin privileges required.");
      } else {
        toast.error(err.response?.data?.error || "Failed to load dashboard");
      }
    }
  };

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
        <StatCard title="Users 👥" value={data.overview?.totalUsers || 0} />
        <StatCard title="Sellers 🏪" value={data.overview?.totalSellers || 0} />
        <StatCard title="Customers 🧑" value={data.overview?.totalCustomers || 0} />
        <StatCard title="Orders 📦" value={data.overview?.totalOrders || 0} />
        <StatCard
          title="Revenue 💰"
          value={`$${Number(data.overview?.totalRevenue || 0).toFixed(2)}`}
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.trend || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4F46E5"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Data Section */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders 🧾</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Order ID</th>
                <th>Customer</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentOrders || []).map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-2">#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>${order.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Users 👥</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentUsers || []).map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}