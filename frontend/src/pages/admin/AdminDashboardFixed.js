import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
  FiEye,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboardFixed = ({ darkMode, setDarkMode }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    pendingSellers: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemInfo, setSystemInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching admin dashboard data...');
        const response = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Admin dashboard response:', response.data);

        const data = response.data;
        
        // Safely set stats with fallbacks
        setStats({
          totalUsers: data.overview?.totalUsers || 0,
          totalSellers: data.overview?.totalSellers || 0,
          totalCustomers: data.overview?.totalCustomers || 0,
          totalOrders: data.overview?.totalOrders || 0,
          totalRevenue: data.overview?.totalRevenue || 0,
          pendingOrders: data.overview?.pendingOrders || 0,
          pendingSellers: data.overview?.pendingSellers || 0
        });
        
        setSalesData(data.trend || []);
        setRecentOrders(data.recentOrders || []);
        setRecentUsers(data.recentUsers || []);
        setTopProducts(data.topProducts || []);
        setTopCategories(data.topCategories || []);
        setRecentActivity(data.recentActivity || []);
        setSystemInfo(data.system || {});
        
        console.log('Dashboard data loaded successfully');
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw className="inline mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
              >
                <FiRefreshCw />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers}
                </p>
              </div>
              <FiUsers className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Sellers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSellers}
                </p>
              </div>
              <FiPackage className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalOrders}
                </p>
              </div>
              <FiShoppingCart className="text-purple-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <FiDollarSign className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sales Trend (6 Months)
            </h3>
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <FiTrendingUp className="text-4xl mb-2" />
                <p>No sales data available</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiActivity className="text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders and Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Orders
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Order #{order.id}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.customer_name} • {formatDate(order.created_at)}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(order.total_price)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p>No orders found</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Users
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiUsers className="text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email} • {user.role} • {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p>No new users</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.pendingOrders}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pendingSellers}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Sellers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {systemInfo.databaseSize || 'N/A'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Database Size</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardFixed;
