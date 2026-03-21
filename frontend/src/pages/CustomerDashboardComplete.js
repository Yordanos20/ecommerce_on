// frontend/src/pages/CustomerDashboardComplete.js
import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { toast } from "react-toastify";

export default function CustomerDashboardComplete({ darkMode, setDarkMode }) {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [notifications, setNotifications] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const profileRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch orders
        const ordersResponse = await fetch("http://localhost:5000/api/orders/customer", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
        }

        // Mock addresses
        setAddresses([
          { id: 1, type: "Home", street: "123 Main St", city: "Addis Ababa", zipCode: "1000", country: "Ethiopia", isDefault: true },
          { id: 2, type: "Office", street: "456 Business Ave", city: "Addis Ababa", zipCode: "1001", country: "Ethiopia", isDefault: false }
        ]);

        // Mock payment methods
        setPaymentMethods([
          { id: 1, type: "Credit Card", last4: "4242", brand: "Visa", isDefault: true },
          { id: 2, type: "Mobile Money", number: "+251912345678", provider: "Telebirr", isDefault: false }
        ]);

        // Mock notifications
        setNotifications([
          { id: 1, type: "order", message: "Your order #1234 has been shipped", time: "2 hours ago", read: false },
          { id: 2, type: "promotion", message: "20% off on electronics this weekend", time: "1 day ago", read: false },
          { id: 3, type: "system", message: "Your profile was updated successfully", time: "2 days ago", read: true }
        ]);

        // Mock recent activity
        setRecentActivity([
          { id: 1, action: "Purchased", item: "Wireless Headphones", time: "2 hours ago", amount: "$299.99" },
          { id: 2, action: "Added to Wishlist", item: "Smart Watch Pro", time: "1 day ago" },
          { id: 3, action: "Reviewed", item: "Laptop Backpack", time: "3 days ago", rating: 5 }
        ]);

      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: "👤", label: "My Profile", path: "/customer/profile", badge: null },
    { icon: "📦", label: "My Orders", path: "/customer/orders", badge: orders.filter(o => o.status === 'pending').length },
    { icon: "❤️", label: "Wishlist", path: "/customer/wishlist", badge: wishlist.length },
    { icon: "🛒", label: "Cart", path: "/cart", badge: cart?.length || 0 },
    { icon: "📍", label: "Saved Addresses", path: "/customer/shipping", badge: addresses.length },
    { icon: "💳", label: "Payment Methods", path: "/customer/payment", badge: paymentMethods.length },
    { icon: "🔔", label: "Notifications", path: "/customer/notifications", badge: notifications.filter(n => !n.read).length },
    { icon: "🆘", label: "Help Center", path: "/customer/support", badge: null },
    { icon: "⚙️", label: "Settings", path: "/customer/settings", badge: null },
    { icon: "🚪", label: "Logout", action: handleLogout, danger: true, badge: null },
  ];

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const completedOrders = orders.filter(order => order.status === "delivered").length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const savedItems = wishlist.length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

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
      {/* Professional Customer Navbar */}
      <nav className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">MyShop</span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition">
                Shop
              </Link>
              <Link to="/customer/orders" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition">
                Orders
              </Link>
              <Link to="/customer/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition">
                Wishlist
              </Link>
              <Link to="/customer/support" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition">
                Help
              </Link>
            </div>

            {/* Right Side - Profile Dropdown */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Link to="/customer/notifications" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538.214 1.055.595 1.405L9 17m6-5v-3a4 4 0 00-8 0v3m8 0v3a2 2 0 11-4 0v-3"></path>
                </svg>
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Premium Member</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="py-2">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {menuItems.map((item, index) => (
                          <div key={index}>
                            {item.action ? (
                              <button
                                onClick={item.action}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition ${
                                  item.danger ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-xl">{item.icon}</span>
                                  <span className="font-medium">{item.label}</span>
                                </div>
                                {item.badge && item.badge > 0 && (
                                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            ) : (
                              <Link
                                to={item.path}
                                className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-gray-700 dark:text-gray-300 transition"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-xl">{item.icon}</span>
                                  <span className="font-medium">{item.label}</span>
                                </div>
                                {item.badge && item.badge > 0 && (
                                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here's your personalized dashboard with all your account information and recent activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Completed Orders</p>
                <p className="text-3xl font-bold text-green-600">{completedOrders}</p>
                <p className="text-xs text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Wishlist Items</p>
                <p className="text-3xl font-bold text-purple-600">{savedItems}</p>
                <p className="text-xs text-gray-500 mt-1">Saved for later</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-indigo-600">${totalSpent.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">+15% from last month</p>
              </div>
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
                <Link to="/customer/orders" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} items
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${order.total_amount || '0.00'}
                          </p>
                        </div>
                        <Link
                          to={`/customer/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Track Order
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📦</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    You haven't placed any orders yet
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Start Shopping
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/products"
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Browse Products</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Discover new items</p>
                  </div>
                </Link>
                <Link
                  to="/customer/wishlist"
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <span className="text-2xl">❤️</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">View Wishlist</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{savedItems} items saved</p>
                  </div>
                </Link>
                <Link
                  to="/customer/shipping"
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Manage Addresses</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{addresses.length} saved</p>
                  </div>
                </Link>
                <Link
                  to="/customer/support"
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <span className="text-2xl">🆘</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Get Help</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">24/7 support</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">
                        {activity.action === 'Purchased' ? '🛒' :
                         activity.action === 'Added to Wishlist' ? '❤️' :
                         activity.action === 'Reviewed' ? '⭐' : '📋'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.action}: {activity.item}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{activity.time}</p>
                      {activity.amount && (
                        <p className="text-sm font-semibold text-green-600">{activity.amount}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
                <Link to="/customer/notifications" className="text-blue-600 hover:text-blue-700 text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">
                        {notification.type === 'order' ? '📦' :
                         notification.type === 'promotion' ? '🎉' :
                         notification.type === 'system' ? '⚙️' : '🔔'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
