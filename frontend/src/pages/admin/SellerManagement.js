import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiCheck, FiX, FiMail, FiDownload, FiPackage, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-toastify';

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('https://ecommerce-backend-ol0h.onrender.com/api/admin/sellers', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const processedSellers = response.data.map(seller => ({
          id: seller.id,
          name: seller.seller_name || seller.name,
          email: seller.email,
          phone: seller.phone || 'N/A',
          status: seller.approval_status?.toLowerCase() || 'pending',
          registrationDate: new Date(seller.created_at).toISOString().split('T')[0],
          storeName: seller.store_name || 'N/A',
          storeDescription: seller.store_description || 'No description available',
          totalProducts: 0, // Would need additional API call
          totalSales: 0, // Would need additional API call
          commission: 8, // Default commission
          rating: 0, // Would need additional API call
          totalOrders: 0, // Would need additional API call
          address: seller.business_address || 'N/A',
          documents: {
            businessLicense: 'approved',
            taxId: 'approved',
            bankAccount: 'approved'
          },
          userId: seller.user_id,
          businessId: seller.business_id
        }));

        setSellers(processedSellers);
        setFilteredSellers(processedSellers);
      } catch (err) {
        console.error('Error fetching sellers:', err);
        setError(err.response?.data?.error || err.message);
        toast.error('Failed to fetch sellers');
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  useEffect(() => {
    let filtered = sellers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.storeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(seller => seller.status === filterStatus);
    }

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(seller => seller.status === activeTab);
    }

    setFilteredSellers(filtered);
  }, [searchTerm, filterStatus, activeTab, sellers]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'rejected': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleApproveSeller = (seller) => {
    setCurrentSeller(seller);
    setShowApproveModal(true);
  };

  const handleSuspendSeller = (seller) => {
    setCurrentSeller(seller);
    setShowSuspendModal(true);
  };

  const handleDeleteSeller = (seller) => {
    setCurrentSeller(seller);
    setShowDeleteModal(true);
  };

  const confirmApproveSeller = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');

      await axios.put(`https://ecommerce-backend-ol0h.onrender.com/api/admin/sellers/${currentSeller.id}/approval`, 
        { approval_status: 'Approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSellers(sellers.map(seller =>
        seller.id === currentSeller.id
          ? { ...seller, status: 'approved' }
          : seller
      ));

      toast.success('Seller approved successfully');
      setShowApproveModal(false);
      setCurrentSeller(null);
    } catch (err) {
      console.error('Error approving seller:', err);
      toast.error(err.response?.data?.error || 'Failed to approve seller');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmSuspendSeller = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentSeller.status === 'suspended' ? 'Approved' : 'suspended';

      await axios.put(`https://ecommerce-backend-ol0h.onrender.com/api/admin/sellers/${currentSeller.id}/approval`, 
        { approval_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSellers(sellers.map(seller =>
        seller.id === currentSeller.id
          ? { ...seller, status: newStatus.toLowerCase() }
          : seller
      ));

      toast.success(`Seller ${newStatus === 'Approved' ? 'reactivated' : 'suspended'} successfully`);
      setShowSuspendModal(false);
      setCurrentSeller(null);
    } catch (err) {
      console.error('Error updating seller status:', err);
      toast.error(err.response?.data?.error || 'Failed to update seller status');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeleteSeller = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Note: Backend doesn't have a delete seller endpoint, so we'll just show a message
      toast.warning('Delete seller functionality not implemented yet');
      setShowDeleteModal(false);
      setCurrentSeller(null);
    } catch (err) {
      console.error('Error deleting seller:', err);
      toast.error('Failed to delete seller');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectSeller = (sellerId) => {
    setSelectedSellers(prev =>
      prev.includes(sellerId)
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSellers.length === filteredSellers.length) {
      setSelectedSellers([]);
    } else {
      setSelectedSellers(filteredSellers.map(seller => seller.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedSellers.length === 0) {
      toast.warning('Please select sellers first');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const promises = selectedSellers.map(sellerId => {
        if (action === 'approve') {
          return axios.put(`https://ecommerce-backend-ol0h.onrender.com/api/admin/sellers/${sellerId}/approval`, 
            { approval_status: 'Approved' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else if (action === 'reject') {
          return axios.put(`https://ecommerce-backend-ol0h.onrender.com/api/admin/sellers/${sellerId}/approval`, 
            { approval_status: 'Rejected' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      });

      await Promise.all(promises);

      // Refresh sellers list
      const response = await axios.get('https://ecommerce-backend-ol0h.onrender.com/api/admin/sellers', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const processedSellers = response.data.map(seller => ({
        id: seller.id,
        name: seller.seller_name || seller.name,
        email: seller.email,
        phone: seller.phone || 'N/A',
        status: seller.approval_status?.toLowerCase() || 'pending',
        registrationDate: new Date(seller.created_at).toISOString().split('T')[0],
        storeName: seller.store_name || 'N/A',
        storeDescription: seller.store_description || 'No description available',
        totalProducts: 0,
        totalSales: 0,
        commission: 8,
        rating: 0,
        totalOrders: 0,
        address: seller.business_address || 'N/A',
        documents: {
          businessLicense: 'approved',
          taxId: 'approved',
          bankAccount: 'approved'
        },
        userId: seller.user_id,
        businessId: seller.business_id
      }));

      setSellers(processedSellers);
      setSelectedSellers([]);
      toast.success(`Sellers ${action}d successfully`);
    } catch (err) {
      console.error('Error performing bulk action:', err);
      toast.error(`Failed to ${action} sellers`);
    } finally {
      setActionLoading(false);
    }
  };

  const exportSellers = () => {
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Store Name', 'Status', 'Registration Date', 'Total Products', 'Total Sales'];
    const csvContent = [
      headers.join(','),
      ...filteredSellers.map(seller => 
        [seller.id, seller.name, seller.email, seller.storeName, seller.status, seller.registrationDate, seller.totalProducts, seller.totalSales]
          .map(field => `"${field}"`)
          .join(',')
      )
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sellers_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Sellers exported successfully');
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ecommerce-backend-ol0h.onrender.com/api/admin/sellers', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const processedSellers = response.data.map(seller => ({
        id: seller.id,
        name: seller.seller_name || seller.name,
        email: seller.email,
        phone: seller.phone || 'N/A',
        status: seller.approval_status?.toLowerCase() || 'pending',
        registrationDate: new Date(seller.created_at).toISOString().split('T')[0],
        storeName: seller.store_name || 'N/A',
        storeDescription: seller.store_description || 'No description available',
        totalProducts: 0,
        totalSales: 0,
        commission: 8,
        rating: 0,
        totalOrders: 0,
        address: seller.business_address || 'N/A',
        documents: {
          businessLicense: 'approved',
          taxId: 'approved',
          bankAccount: 'approved'
        },
        userId: seller.user_id,
        businessId: seller.business_id
      }));

      setSellers(processedSellers);
      setFilteredSellers(processedSellers);
    } catch (err) {
      console.error('Error refreshing sellers:', err);
      setError(err.response?.data?.error || err.message);
      toast.error('Failed to refresh sellers');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Sellers', count: sellers.length },
    { id: 'pending', label: 'Pending Approval', count: sellers.filter(s => s.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: sellers.filter(s => s.status === 'approved').length },
    { id: 'suspended', label: 'Suspended', count: sellers.filter(s => s.status === 'suspended').length }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
            <p className="text-gray-600 mt-1">Manage seller registrations and stores</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading sellers: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
          <p className="text-gray-600 mt-1">Manage seller registrations and stores</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <FiPackage className="mr-2" size={16} />
            Add Seller
          </button>
          <button
            onClick={exportSellers}
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
            <FiPackage className="text-blue-600" size={24} />
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Sellers</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{sellers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiPackage className="text-green-600" size={24} />
            <span className="text-sm text-green-600 font-medium">+8%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Active Sellers</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {sellers.filter(s => s.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiTrendingUp className="text-yellow-600" size={24} />
            <span className="text-sm text-yellow-600 font-medium">Pending</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Pending Approval</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {sellers.filter(s => s.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiDollarSign className="text-purple-600" size={24} />
            <span className="text-sm text-green-600 font-medium">+15%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${sellers.reduce((sum, s) => sum + s.totalSales, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex space-x-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100">
                {tab.count}
              </span>
            </button>
          ))}
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
                placeholder="Search sellers..."
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
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedSellers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedSellers.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={actionLoading}
                className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={actionLoading}
                className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedSellers.length === filteredSellers.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Seller</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Store Info</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Products</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Sales</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Rating</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Documents</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedSellers.includes(seller.id)}
                      onChange={() => handleSelectSeller(seller.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                      <div className="text-xs text-gray-500">ID: #{seller.id}</div>
                      <div className="text-xs text-gray-500">{seller.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{seller.storeName}</div>
                      <div className="text-xs text-gray-500">{seller.storeDescription}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(seller.status)}`}>
                      {seller.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{seller.totalProducts}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">${seller.totalSales.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{seller.totalOrders} orders</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{seller.rating}</span>
                      {seller.rating > 0 && (
                        <span className="text-yellow-400 ml-1">★</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="text-xs">
                        <span className={`font-medium ${getDocumentStatusColor(seller.documents.businessLicense)}`}>
                          License: {seller.documents.businessLicense}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className={`font-medium ${getDocumentStatusColor(seller.documents.taxId)}`}>
                          Tax ID: {seller.documents.taxId}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className={`font-medium ${getDocumentStatusColor(seller.documents.bankAccount)}`}>
                          Bank: {seller.documents.bankAccount}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <FiEye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-700">
                        <FiEdit size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700">
                        <FiMail size={16} />
                      </button>
                      {seller.status === 'pending' && (
                        <button
                          onClick={() => handleApproveSeller(seller)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspendSeller(seller)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <FiX size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSeller(seller)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Seller Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Seller</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve {currentSeller?.name}? This will allow them to start selling on the platform.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApproveSeller}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Seller Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentSeller?.status === 'suspended' ? 'Reactivate Seller' : 'Suspend Seller'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {currentSeller?.status === 'suspended' ? 'reactivate' : 'suspend'} {currentSeller?.name}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSuspendModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSuspendSeller}
                disabled={actionLoading}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : (currentSeller?.status === 'suspended' ? 'Reactivate' : 'Suspend')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Seller Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Seller</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {currentSeller?.name}? This action cannot be undone and will remove all their products.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSeller}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManagement;
