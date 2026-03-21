import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboardSimple = ({ darkMode, setDarkMode }) => {
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
      console.log('Token found:', token ? 'Yes' : 'No');
      console.log('Token value:', token?.substring(0, 20) + '...');
      
      if (!token) {
        setError('No authentication token found. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
        return;
      }

      console.log('Making API call to /api/admin/dashboard...');
      const response = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);

      const data = response.data;
      setStats({
        users: data.overview?.totalUsers || 0,
        sellers: data.overview?.totalSellers || 0,
        orders: data.overview?.totalOrders || 0,
        revenue: data.overview?.totalRevenue || 0
      });
      setLoading(false);
    } catch (err) {
      console.error('Detailed error:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      } else {
        setError('Failed to load dashboard: ' + (err.response?.data?.error || err.message));
      }
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
      
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800">🔐 Authentication Help</h3>
        <p className="text-yellow-700 mt-2">If you're seeing authentication errors, try clearing your token:</p>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
          }}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Clear Token & Re-login
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardSimple;
