import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiLock, FiUnlock, FiMail, FiDownload, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const processedUsers = response.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          status: user.is_active ? 'active' : 'blocked',
          registeredDate: new Date(user.created_at).toISOString().split('T')[0],
          lastLogin: user.last_order_date ? new Date(user.last_order_date).toISOString().split('T')[0] : 'N/A',
          totalOrders: user.total_orders || 0,
          totalSpent: user.total_spent || 0,
          address: user.address || 'N/A',
          role: user.role || 'customer'
        }));

        setUsers(processedUsers);
        setFilteredUsers(processedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.error || err.message);
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterStatus, users]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleBlockUser = (user) => {
    setCurrentUser(user);
    setShowBlockModal(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const confirmBlockUser = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentUser.status === 'active' ? 0 : 1;

      await axios.put(`/api/admin/users/${currentUser.id}/status`, 
        { is_active: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map(user =>
        user.id === currentUser.id
          ? { ...user, status: newStatus ? 'active' : 'blocked' }
          : user
      ));

      toast.success(`User ${newStatus ? 'unblocked' : 'blocked'} successfully`);
      setShowBlockModal(false);
      setCurrentUser(null);
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error(err.response?.data?.error || 'Failed to update user status');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeleteUser = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`/api/admin/users/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.filter(user => user.id !== currentUser.id));
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setCurrentUser(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select users first');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const promises = selectedUsers.map(userId => {
        if (action === 'block') {
          return axios.put(`/api/admin/users/${userId}/status`, 
            { is_active: 0 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else if (action === 'delete') {
          return axios.delete(`/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        return null;
      }).filter(Boolean);

      await Promise.all(promises);

      // Refresh users list
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const processedUsers = response.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || 'N/A',
        status: user.is_active ? 'active' : 'blocked',
        registeredDate: new Date(user.created_at).toISOString().split('T')[0],
        lastLogin: 'N/A',
        totalOrders: 0,
        totalSpent: 0,
        address: user.address || 'N/A',
        role: user.role || 'customer'
      }));

      setUsers(processedUsers);
      setSelectedUsers([]);
      toast.success(`Users ${action}d successfully`);
    } catch (err) {
      console.error('Error performing bulk action:', err);
      toast.error(`Failed to ${action} users`);
    } finally {
      setActionLoading(false);
    }
  };

  const exportUsers = () => {
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Role', 'Registered Date'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => 
        [user.id, user.name, user.email, user.phone, user.status, user.role, user.registeredDate]
          .map(field => `"${field}"`)
          .join(',')
      )
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Users exported successfully');
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const processedUsers = response.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || 'N/A',
        status: user.is_active ? 'active' : 'blocked',
        registeredDate: new Date(user.created_at).toISOString().split('T')[0],
        lastLogin: 'N/A',
        totalOrders: 0,
        totalSpent: 0,
        address: user.address || 'N/A',
        role: user.role || 'customer'
      }));

      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
    } catch (err) {
      console.error('Error refreshing users:', err);
      setError(err.response?.data?.error || err.message);
      toast.error('Failed to refresh users');
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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all customer accounts</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading users: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all customer accounts</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <FiUser className="mr-2" size={16} />
            Add User
          </button>
          <button
            onClick={exportUsers}
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
          <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm font-medium">Active Users</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm font-medium">Blocked Users</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {users.filter(u => u.status === 'blocked').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm font-medium">Suspended Users</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {users.filter(u => u.status === 'suspended').length}
          </p>
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
                placeholder="Search users..."
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
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('block')}
                disabled={actionLoading}
                className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
              >
                Block
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Contact</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Orders</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Total Spent</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Registered</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">ID: #{user.id}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{user.totalOrders}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">${user.totalSpent}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.registeredDate}</td>
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
                      <button
                        onClick={() => handleBlockUser(user)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        {user.status === 'active' ? <FiLock size={16} /> : <FiUnlock size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
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

      {/* Block User Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentUser?.status === 'active' ? 'Block User' : 'Unblock User'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {currentUser?.status === 'active' ? 'block' : 'unblock'} {currentUser?.name}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBlockModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlockUser}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : (currentUser?.status === 'active' ? 'Block' : 'Unblock')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {currentUser?.name}? This action cannot be undone.
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
                onClick={confirmDeleteUser}
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

export default UserManagement;
