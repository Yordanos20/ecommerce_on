import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBell, FiCheck, FiTrash2, FiEye, FiMail, FiShoppingCart, FiUsers, FiPackage, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/api/admin/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const processedNotifications = response.data.map(notification => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type || 'system',
          status: notification.is_read ? 'read' : 'unread',
          priority: notification.priority || 'medium',
          createdAt: new Date(notification.created_at).toISOString(),
          relatedId: notification.related_id,
          relatedType: notification.related_type,
          actionRequired: notification.action_required || false
        }));

        setNotifications(processedNotifications);
        setFilteredNotifications(processedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.response?.data?.error || err.message);
        toast.error('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    let filtered = notifications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(notification => notification.status === filterStatus);
    }

    setFilteredNotifications(filtered);
  }, [searchTerm, filterType, filterStatus, notifications]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order': return <FiShoppingCart className="text-blue-600" size={20} />;
      case 'user': return <FiUsers className="text-green-600" size={20} />;
      case 'product': return <FiPackage className="text-purple-600" size={20} />;
      case 'system': return <FiBell className="text-gray-600" size={20} />;
      default: return <FiMail className="text-orange-600" size={20} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'text-blue-600 bg-blue-100';
      case 'read': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, status: 'read' }
          : notification
      ));
      toast.success('Notification marked as read');
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/admin/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(notifications.map(notification => ({ ...notification, status: 'read' })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(notifications.filter(notification => notification.id !== notificationId));
      toast.success('Notification deleted successfully');
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete notification');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedNotifications.length === 0) {
      toast.warning('Please select notifications first');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (action === 'markRead') {
        await axios.put('/api/admin/notifications/mark-multiple-read', {
          notificationIds: selectedNotifications
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setNotifications(notifications.map(notification =>
          selectedNotifications.includes(notification.id)
            ? { ...notification, status: 'read' }
            : notification
        ));
        toast.success('Selected notifications marked as read');
      } else if (action === 'delete') {
        await axios.delete('/api/admin/notifications/bulk', {
          data: { notificationIds: selectedNotifications }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setNotifications(notifications.filter(notification => !selectedNotifications.includes(notification.id)));
        toast.success('Selected notifications deleted');
      }

      setSelectedNotifications([]);
    } catch (err) {
      console.error('Error performing bulk action:', err);
      toast.error('Failed to perform bulk action');
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(notification => notification.id));
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const processedNotifications = response.data.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'system',
        status: notification.is_read ? 'read' : 'unread',
        priority: notification.priority || 'medium',
        createdAt: new Date(notification.created_at).toISOString(),
        relatedId: notification.related_id,
        relatedType: notification.related_type,
        actionRequired: notification.action_required || false
      }));

      setNotifications(processedNotifications);
      setFilteredNotifications(processedNotifications);
    } catch (err) {
      console.error('Error refreshing notifications:', err);
      setError(err.response?.data?.error || err.message);
      toast.error('Failed to refresh notifications');
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
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">Manage system notifications</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading notifications: {error}</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Manage system notifications</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiBell className="text-blue-600" size={24} />
            <span className="text-sm text-red-600 font-medium">New</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Unread</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiFilter className="text-red-600" size={24} />
            <span className="text-sm text-red-600 font-medium">Urgent</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">High Priority</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{highPriorityCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiEye className="text-green-600" size={24} />
            <span className="text-sm text-green-600 font-medium">Today</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Notifications</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{notifications.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FiCheck className="text-purple-600" size={24} />
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Action Required</h3>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {notifications.filter(n => n.actionRequired).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="order">Orders</option>
              <option value="user">Users</option>
              <option value="product">Products</option>
              <option value="system">System</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedNotifications.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('markRead')}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
              >
                Mark as Read
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Message</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Priority</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Time</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <tr 
                  key={notification.id} 
                  className={`hover:bg-gray-50 ${notification.status === 'unread' ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {getTypeIcon(notification.type)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{notification.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{notification.title}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600 max-w-xs truncate">{notification.message}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(notification.status)}`}>
                      {notification.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">{formatTime(notification.createdAt)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <FiEye size={16} />
                      </button>
                      {notification.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
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

      {filteredNotifications.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-600">No notifications found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement;
