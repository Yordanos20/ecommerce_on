import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminRevenue() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats({
        totalRevenue: Number(res.data.totalRevenue || 0),
        totalOrders: Number(res.data.totalOrders || 0),
      });
    };
    load();
  }, []);

  const avgOrder = stats.totalOrders ? stats.totalRevenue / stats.totalOrders : 0;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white shadow rounded-xl p-6">
        <p className="text-gray-500">Total Revenue</p>
        <h3 className="text-3xl font-bold mt-2">${stats.totalRevenue.toFixed(2)}</h3>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <p className="text-gray-500">Total Orders</p>
        <h3 className="text-3xl font-bold mt-2">{stats.totalOrders}</h3>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <p className="text-gray-500">Average Order Value</p>
        <h3 className="text-3xl font-bold mt-2">${avgOrder.toFixed(2)}</h3>
      </div>
    </div>
  );
}
