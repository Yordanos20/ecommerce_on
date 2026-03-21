import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiShoppingBag, FiHeart, FiPackage, FiUser, FiLogOut, FiBell, FiMapPin, FiClock, FiDollarSign, FiEye, FiEdit, FiTrash2, FiChevronRight, FiGrid, FiList } from "react-icons/fi";
import axios from "axios";

export default function CustomerDashboardSimple({ darkMode, setDarkMode }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: { total_orders: 0, total_spent: 0, pending_orders: 0, completed_orders: 0 },
    orders: [],
    addresses: [],
    notifications: [],
    wishlistItems: []
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/customer/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewOrder = (orderId) => {
    navigate(`/customer/orders/${orderId}`);
  };

  const handleViewWishlist = () => {
    navigate('/customer/wishlist');
  };

  const handleViewOrders = () => {
    navigate('/customer/orders');
  };

  const handleEditProfile = () => {
    navigate('/customer/profile');
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ShopHub
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
                My Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative cursor-pointer" onClick={() => setActiveSection('notifications')}>
                <FiBell className="text-gray-600 dark:text-gray-300 text-xl hover:text-blue-600 transition-colors" />
                {dashboardData.notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {dashboardData.notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors"
              >
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Here's what's happening with your orders and account
              </p>
            </div>
            <div className="text-right mt-4 sm:mt-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.created_at ? formatDate(user.created_at) : 'Recent'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            {['overview', 'orders', 'wishlist', 'addresses', 'notifications'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === section
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewOrders}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.stats.total_orders}
                    </p>
                  </div>
                  <FiPackage className="text-blue-600 text-2xl" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${dashboardData.stats.total_spent.toFixed(2)}
                    </p>
                  </div>
                  <FiDollarSign className="text-green-600 text-2xl" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewOrders}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.stats.pending_orders}
                    </p>
                  </div>
                  <FiClock className="text-yellow-600 text-2xl" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewWishlist}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wishlist</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.wishlistItems.length}
                    </p>
                  </div>
                  <FiHeart className="text-red-600 text-2xl" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recent Orders
                    </h3>
                    <button
                      onClick={handleViewOrders}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      View All
                      <FiChevronRight className="ml-1" />
                    </button>
                  </div>

                  {dashboardData.orders.length === 0 ? (
                    <div className="text-center py-8">
                      <FiShoppingBag className="text-gray-400 text-4xl mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
                      <Link
                        to="/products"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Shopping
                        <FiShoppingBag className="ml-2" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dashboardData.orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(order.created_at)} • {order.item_count} items
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                ${order.total_price.toFixed(2)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/products')}
                      className="w-full flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <FiShoppingBag />
                      <span>Shop Now</span>
                    </button>
                    <button
                      onClick={handleViewWishlist}
                      className="w-full flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <FiHeart />
                      <span>My Wishlist</span>
                    </button>
                    <button
                      onClick={handleViewOrders}
                      className="w-full flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <FiPackage />
                      <span>Order History</span>
                    </button>
                    <button
                      onClick={handleEditProfile}
                      className="w-full flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <FiUser />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setActiveSection('notifications')}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {dashboardData.notifications.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No new notifications
                      </p>
                    ) : (
                      dashboardData.notifications.slice(0, 3).map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => handleMarkNotificationRead(notification.id)}
                        >
                          <FiBell className={`text-sm mt-1 ${!notification.is_read ? 'text-blue-600' : 'text-gray-400'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        {activeSection === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order History
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FiList />
                </button>
              </div>
            </div>

            {dashboardData.orders.length === 0 ? (
              <div className="text-center py-8">
                <FiPackage className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
                <Link
                  to="/products"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {dashboardData.orders.map((order) => (
                  <div
                    key={order.id}
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      viewMode === 'list' ? 'flex justify-between items-center' : ''
                    }`}
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(order.created_at)} • {order.item_count} items
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        ${order.total_price.toFixed(2)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Section */}
        {activeSection === 'wishlist' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              My Wishlist
            </h3>

            {dashboardData.wishlistItems.length === 0 ? (
              <div className="text-center py-8">
                <FiHeart className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Your wishlist is empty</p>
                <Link
                  to="/products"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dashboardData.wishlistItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={item.image || 'https://via.placeholder.com/200x200'}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <button
                        onClick={() => handleRemoveFromWishlist(item.product_id)}
                        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <FiTrash2 className="text-red-500 text-sm" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {item.name}
                    </h4>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProduct(item.product_id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <FiEye className="mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => navigate('/cart')}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <FiShoppingBag className="mr-1" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Section */}
        {activeSection === 'addresses' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Shipping Addresses
              </h3>
              <button
                onClick={() => navigate('/customer/profile')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FiEdit className="mr-2" />
                Add Address
              </button>
            </div>

            {dashboardData.addresses.length === 0 ? (
              <div className="text-center py-8">
                <FiMapPin className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No addresses saved</p>
                <button
                  onClick={() => navigate('/customer/profile')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {address.type}
                      </h4>
                      {address.is_default && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <p>{address.address}</p>
                      <p>{address.city}, {address.state} {address.zip}</p>
                      <p>{address.country}</p>
                      <p>{address.phone}</p>
                      <p>{address.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {dashboardData.notifications.filter(n => !n.is_read).length} unread
              </span>
            </div>

            {dashboardData.notifications.length === 0 ? (
              <div className="text-center py-8">
                <FiBell className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No notifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg border ${
                      !notification.is_read
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <FiBell className={`text-lg mt-1 ${!notification.is_read ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkNotificationRead(notification.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
