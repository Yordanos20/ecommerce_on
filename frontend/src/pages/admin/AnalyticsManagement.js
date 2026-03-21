import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiDownload, FiCalendar, FiBarChart } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'react-toastify';

const AnalyticsManagement = () => {
  const [salesData, setSalesData] = useState([]);
  const [sellerPerformance, setSellerPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('sales');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const [salesResponse, sellersResponse] = await Promise.all([
          axios.get('/api/admin/reports/sales', {
            headers: { Authorization: `Bearer ${token}` },
            params: { period: dateRange }
          }),
          axios.get('/api/admin/reports/sellers', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const processedSalesData = salesResponse.data.map(item => ({
          month: item.period,
          sales: parseFloat(item.sales) || 0,
          orders: parseInt(item.orders) || 0,
          revenue: parseFloat(item.revenue) || 0
        }));

        const processedSellersData = sellersResponse.data.map(seller => ({
          id: seller.id,
          storeName: seller.store_name || 'Unknown Store',
          sellerName: seller.seller_name || 'Unknown Seller',
          totalOrders: parseInt(seller.total_orders) || 0,
          totalRevenue: parseFloat(seller.total_revenue) || 0,
          totalProducts: parseInt(seller.total_products) || 0
        }));

        setSalesData(processedSalesData);
        setSellerPerformance(processedSellersData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.response?.data?.error || err.message);
        toast.error('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const exportReport = () => {
    let data, filename;
    
    if (reportType === 'sales') {
      data = salesData;
      filename = 'sales_report.csv';
    } else if (reportType === 'sellers') {
      data = sellerPerformance;
      filename = 'seller_performance_report.csv';
    } else {
      return;
    }

    const headers = reportType === 'sales' 
      ? ['Month', 'Sales', 'Orders', 'Revenue']
      : ['Store Name', 'Seller Name', 'Total Orders', 'Total Revenue', 'Total Products'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(item => 
        reportType === 'sales'
          ? [item.month, item.sales, item.orders, item.revenue]
          : [item.storeName, item.sellerName, item.totalOrders, item.totalRevenue, item.totalProducts]
          .map(field => `"${field}"`)
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const [salesResponse, sellersResponse] = await Promise.all([
        axios.get('/api/admin/reports/sales', {
          headers: { Authorization: `Bearer ${token}` },
          params: { period: dateRange }
        }),
        axios.get('/api/admin/reports/sellers', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const processedSalesData = salesResponse.data.map(item => ({
        month: item.period,
        sales: parseFloat(item.sales) || 0,
        orders: parseInt(item.orders) || 0,
        revenue: parseFloat(item.revenue) || 0
      }));

      const processedSellersData = sellersResponse.data.map(seller => ({
        id: seller.id,
        storeName: seller.store_name || 'Unknown Store',
        sellerName: seller.seller_name || 'Unknown Seller',
        totalOrders: parseInt(seller.total_orders) || 0,
        totalRevenue: parseFloat(seller.total_revenue) || 0,
        totalProducts: parseInt(seller.total_products) || 0
      }));

      setSalesData(processedSalesData);
      setSellerPerformance(processedSellersData);
    } catch (err) {
      console.error('Error refreshing analytics:', err);
      setError(err.response?.data?.error || err.message);
      toast.error('Failed to refresh analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const totalSales = sellerPerformance.reduce((sum, seller) => sum + seller.totalRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sales">Sales Report</option>
            <option value="sellers">Seller Performance</option>
          </select>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            <FiDownload className="mr-2" size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FiCalendar className="text-gray-600" size={20} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiDollarSign className="text-blue-600" size={24} />
            <span className="text-sm text-green-600 font-medium">+18%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiShoppingCart className="text-green-600" size={24} />
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiUsers className="text-purple-600" size={24} />
            <span className="text-sm text-purple-600 font-medium">+8%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Active Sellers</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{sellerPerformance.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiTrendingUp className="text-orange-600" size={24} />
            <span className="text-sm text-green-600 font-medium">+15%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Avg Order Value</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Bar dataKey="orders" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seller Performance Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Sellers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Store Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Seller Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Total Orders</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Total Revenue</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Total Products</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sellerPerformance.slice(0, 10).map((seller, index) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{seller.storeName}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{seller.sellerName}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">{seller.totalOrders.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">${seller.totalRevenue.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{seller.totalProducts.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        index < 3 ? 'bg-green-100 text-green-600' :
                        index < 6 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index < 3 ? 'Excellent' : index < 6 ? 'Good' : 'Average'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monthly Growth</span>
              <span className="text-sm font-medium text-green-600">+18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Best Month</span>
              <span className="text-sm font-medium text-gray-900">December</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-medium text-blue-600">3.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Top Category</span>
              <span className="text-sm font-medium text-gray-900">Electronics</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Product Price</span>
              <span className="text-sm font-medium text-gray-900">$45.50</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Products Sold</span>
              <span className="text-sm font-medium text-gray-900">1,247</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Customers</span>
              <span className="text-sm font-medium text-green-600">+234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Retention Rate</span>
              <span className="text-sm font-medium text-blue-600">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Order Value</span>
              <span className="text-sm font-medium text-gray-900">$67.80</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManagement;
