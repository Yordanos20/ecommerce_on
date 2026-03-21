import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiEye, FiDownload, FiDollarSign, FiCreditCard, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/api/admin/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const processedPayments = response.data.map(payment => ({
          id: payment.id,
          orderId: payment.order_id,
          customerName: payment.customer_name || 'Unknown Customer',
          amount: parseFloat(payment.amount) || 0,
          method: payment.payment_method || 'Unknown',
          status: payment.status || 'pending',
          date: new Date(payment.created_at).toISOString().split('T')[0],
          transactionId: payment.transaction_id || `TXN${payment.id}`,
          customerEmail: payment.customer_email || 'N/A',
          orderStatus: payment.order_status || 'Processing'
        }));

        setPayments(processedPayments);
        setFilteredPayments(processedPayments);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err.response?.data?.error || err.message);
        toast.error('Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === filterStatus);
    }

    // Filter by payment method
    if (filterMethod !== 'all') {
      filtered = filtered.filter(payment => payment.method.toLowerCase() === filterMethod);
    }

    setFilteredPayments(filtered);
  }, [searchTerm, filterStatus, filterMethod, payments]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': case 'success': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': case 'cancelled': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'credit card': case 'card': return <FiCreditCard size={16} />;
      default: return <FiDollarSign size={16} />;
    }
  };

  const exportPayments = () => {
    const headers = ['Transaction ID', 'Order ID', 'Customer Name', 'Email', 'Amount', 'Method', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment => 
        [payment.transactionId, payment.orderId, payment.customerName, payment.customerEmail, payment.amount, payment.method, payment.status, payment.date]
          .map(field => `"${field}"`)
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Payments exported successfully');
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const processedPayments = response.data.map(payment => ({
        id: payment.id,
        orderId: payment.order_id,
        customerName: payment.customer_name || 'Unknown Customer',
        amount: parseFloat(payment.amount) || 0,
        method: payment.payment_method || 'Unknown',
        status: payment.status || 'pending',
        date: new Date(payment.created_at).toISOString().split('T')[0],
        transactionId: payment.transaction_id || `TXN${payment.id}`,
        customerEmail: payment.customer_email || 'N/A',
        orderStatus: payment.order_status || 'Processing'
      }));

      setPayments(processedPayments);
      setFilteredPayments(processedPayments);
    } catch (err) {
      console.error('Error refreshing payments:', err);
      setError(err.response?.data?.error || err.message);
      toast.error('Failed to refresh payments');
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
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-1">Monitor all transactions and payments</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading payments: {error}</p>
        </div>
      </div>
    );
  }

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = payments.filter(p => p.status.toLowerCase() === 'completed' || p.status.toLowerCase() === 'success');
  const pendingPayments = payments.filter(p => p.status.toLowerCase() === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">Monitor all transactions and payments</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportPayments}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            <FiDownload className="mr-2" size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiDollarSign className="text-blue-600" size={24} />
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiCreditCard className="text-green-600" size={24} />
            <span className="text-sm text-green-600 font-medium">+8%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Completed Payments</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{completedPayments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiCalendar className="text-yellow-600" size={24} />
            <span className="text-sm text-yellow-600 font-medium">Pending</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Pending Payments</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingPayments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiTrendingUp className="text-purple-600" size={24} />
            <span className="text-sm text-green-600 font-medium">+15%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Transactions</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{payments.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Method Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="credit card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="chapa">Chapa</option>
              <option value="bank transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Transaction ID</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Method</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Order Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{payment.transactionId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">#{payment.orderId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{payment.customerName}</div>
                      <div className="text-sm text-gray-600">{payment.customerEmail}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {getMethodIcon(payment.method)}
                      <span className="ml-2 text-sm text-gray-900">{payment.method}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' :
                      payment.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-600' :
                      payment.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {payment.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{payment.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <FiEye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-600">No payments found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
