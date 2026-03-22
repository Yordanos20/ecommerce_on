import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiGrid,
  FiShoppingCart,
  FiCreditCard,
  FiBarChart2,
  FiFileText,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiTrendingUp,
  FiDollarSign,
  FiUser,
  FiSearch,
  FiHelpCircle,
  FiRefreshCw,
  FiCheck,
  FiXCircle,
  FiAlertCircle,
  FiShoppingBag as FiOrder
} from 'react-icons/fi';
import axios from 'axios';

const AdminLayout = ({ darkMode, setDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  // Essential admin navbar items only
  const menuItems = [
    { 
      path: '/admin/dashboard', 
      icon: FiHome, 
      label: 'Dashboard'
    },
    { 
      path: '/admin/users', 
      icon: FiUsers, 
      label: 'Users'
    },
    { 
      path: '/admin/sellers', 
      icon: FiPackage, 
      label: 'Sellers'
    },
    { 
      path: '/admin/products', 
      icon: FiShoppingBag, 
      label: 'Products'
    },
    { 
      path: '/admin/orders', 
      icon: FiShoppingCart, 
      label: 'Orders'
    },
    { 
      path: '/admin/analytics', 
      icon: FiBarChart2, 
      label: 'Analytics'
    },
    { 
      path: '/admin/settings', 
      icon: FiSettings, 
      label: 'Settings'
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };

  // Fetch notifications from real database
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch real notifications from database
        const response = await axios.get('https://ecommerce-backend-ol0h.onrender.com/api/admin/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.notifications) {
          setNotifications(response.data.notifications);
          const unread = response.data.notifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        } else {
          // Fallback to dashboard data if no dedicated notifications endpoint
          const dashboardResponse = await axios.get('https://ecommerce-backend-ol0h.onrender.com/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const notifications = [];
          
          // Add recent orders as notifications
          if (dashboardResponse.data.recentOrders) {
            dashboardResponse.data.recentOrders.slice(0, 3).forEach(order => {
              notifications.push({
                id: `order-${order.id}`,
                type: 'order',
                title: 'New Order Received',
                message: `Order #${order.id} - ${order.customer_name} - $${order.total_price}`,
                time: getTimeAgo(order.created_at),
                read: false,
                icon: FiOrder,
                color: 'blue'
              });
            });
          }

          // Add new sellers as notifications
          if (dashboardResponse.data.overview?.pendingSellers > 0) {
            notifications.push({
              id: 'sellers-pending',
              type: 'seller',
              title: 'Pending Seller Applications',
              message: `${dashboardResponse.data.overview.pendingSellers} sellers awaiting approval`,
              time: '1 hour ago',
              read: false,
              icon: FiPackage,
              color: 'green'
            });
          }

          // Add new users as notifications
          if (dashboardResponse.data.recentUsers) {
            dashboardResponse.data.recentUsers.slice(0, 2).forEach(user => {
              notifications.push({
                id: `user-${user.id}`,
                type: 'user',
                title: 'New User Registration',
                message: `${user.name || user.email} joined as a customer`,
                time: getTimeAgo(user.created_at),
                read: false,
                icon: FiUsers,
                color: 'purple'
              });
            });
          }

          // Add low stock alerts if products exist
          if (dashboardResponse.data.topProducts) {
            const lowStockProducts = dashboardResponse.data.topProducts.filter(p => p.stock < 10);
            if (lowStockProducts.length > 0) {
              notifications.push({
                id: 'low-stock',
                type: 'alert',
                title: 'Low Stock Alert',
                message: `${lowStockProducts.length} products running low on stock`,
                time: '2 hours ago',
                read: false,
                icon: FiAlertCircle,
                color: 'yellow'
              });
            }
          }

          setNotifications(notifications);
          const unread = notifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Set empty notifications on error
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Redirect based on notification type and data
    switch(notification.type) {
      case 'order':
        // Redirect to order details page
        if (notification.orderId) {
          window.location.href = `/admin/orders/${notification.orderId}`;
        } else {
          window.location.href = '/admin/orders';
        }
        break;
        
      case 'user':
        
      case 'seller':
        // Redirect to seller management
        if (notification.sellerId) {
          window.location.href = `/admin/sellers/${notification.sellerId}`;
        } else {
          window.location.href = '/admin/sellers';
        }
        break;
        
      case 'product':
        // Redirect to product management
        if (notification.productId) {
          window.location.href = `/admin/products/${notification.productId}`;
        } else {
          window.location.href = '/admin/products';
        }
        break;
        
      case 'payment':
        // Redirect to payment/revenue page
        window.location.href = '/admin/payments';
        break;
        
      case 'review':
        // Redirect to reviews management
        window.location.href = '/admin/reviews';
        break;
        
      case 'system':
        // Redirect to admin settings
        window.location.href = '/admin/settings';
        break;
        
      default:
        // Default redirect to dashboard
        window.location.href = '/admin/dashboard';
        break;
    }
  };

  const getNotificationIcon = (icon, color) => {
    const Icon = icon;
    const colorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      yellow: 'text-yellow-500',
      red: 'text-red-500'
    };
    return <Icon className={colorClasses[color] || 'text-gray-500'} />;
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:relative
        ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl 
        transition-all duration-300 ease-in-out 
        z-50
        h-full
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-white text-lg" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Admin Panel
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  E-commerce Platform
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    relative flex items-center p-3 rounded-lg transition-all duration-200
                    ${isActive(item.path)
                      ? darkMode 
                        ? 'bg-blue-900 text-blue-300 shadow-lg'
                        : 'bg-blue-50 text-blue-600 shadow-sm'
                      : darkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <item.icon size={20} className="min-w-[20px]" />
                  {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Notifications */}
          {sidebarOpen && (
            <div className="mb-4">
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <FiBell size={20} className="min-w-[20px]" />
                  <span className="ml-3 font-medium">Notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600'
                    }`}>
                      {unreadCount}
                    </span>
                  )}
                  <FiChevronDown size={16} className={`transform transition-transform ${notificationDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Notification Dropdown */}
              {notificationDropdownOpen && (
                <div className={`absolute bottom-full left-4 right-4 mb-2 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border max-h-80 overflow-hidden`}>
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:bg-opacity-50 ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getNotificationIcon(notification.icon, notification.color)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {notification.title}
                                  </p>
                                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                    {notification.message}
                                  </p>
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiBell size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-red-900 text-red-400' 
                : 'hover:bg-red-50 text-red-600'
            }`}
          >
            <FiLogOut size={20} className="min-w-[20px]" />
            {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
