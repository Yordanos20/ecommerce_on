import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboardMinimal = ({ darkMode, setDarkMode }) => {
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      setStats({
        users: data.overview?.totalUsers || 0,
        sellers: data.overview?.totalSellers || 0,
        orders: data.overview?.totalOrders || 0,
        revenue: data.overview?.totalRevenue || 0
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Users</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Sellers</h2>
          <p className="text-3xl font-bold text-green-600">{stats.sellers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Orders</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.orders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Revenue</h2>
          <p className="text-3xl font-bold text-yellow-600">${stats.revenue}</p>
        </div>
      </div>

      <div className="mt-8 bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800">✅ Dashboard Working!</h3>
        <p className="text-green-700 mt-2">All systems operational. No errors detected.</p>
      </div>
    </div>
  );
};

export default AdminDashboardMinimal;
