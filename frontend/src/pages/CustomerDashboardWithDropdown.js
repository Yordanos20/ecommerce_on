// frontend/src/pages/CustomerDashboardWithDropdown.js
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

export default function CustomerDashboardWithDropdown({ darkMode, setDarkMode }) {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch orders
        const ordersResponse = await fetch("https://ecommerce-backend-ol0h.onrender.com/api/orders/customer", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
        }

        // Mock addresses
        setAddresses([
          { id: 1, type: "Home", street: "123 Main St", city: "Addis Ababa", zipCode: "1000", country: "Ethiopia", isDefault: true },
          { id: 2, type: "Office", street: "456 Business Ave", city: "Addis Ababa", zipCode: "1001", country: "Ethiopia", isDefault: false },
          { id: 3, type: "Shipping", street: "789 Commerce St", city: "Addis Ababa", zipCode: "1002", country: "Ethiopia", isDefault: false }
        ]);

        // Mock notifications
        setNotifications([
          { id: 1, type: "order", message: "Your order #1234 has been shipped", time: "2 hours ago", read: false },
          { id: 2, type: "promotion", message: "20% off on electronics this weekend", time: "1 day ago", read: false },
          { id: 3, type: "system", message: "Your profile was updated successfully", time: "2 days ago", read: true },
          { id: 4, type: "wishlist", message: "Price drop on items in your wishlist", time: "3 days ago", read: false }
        ]);

        // Mock recent activity
        setRecentActivity([
          { id: 1, action: "Purchased", item: "Wireless Headphones", time: "2 hours ago", amount: "$299.99" },
          { id: 2, action: "Added to Wishlist", item: "Smart Watch Pro", time: "1 day ago" },
          { id: 3, action: "Reviewed", item: "Laptop Backpack", time: "3 days ago", rating: 5 },
          { id: 4, action: "Updated Profile", item: "Personal information", time: "4 days ago" },
          { id: 5, action: "Added Address", item: "Office address", time: "5 days ago" }
        ]);

      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const completedOrders = orders.filter(order => order.status === "delivered").length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const savedItems = wishlist.length;

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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/products"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Shop Now</h3>
                <p className="text-blue-100 text-sm">Browse products</p>
              </div>
              <span className="text-3xl">🛍️</span>
            </div>
          </Link>

          <Link
            to="/cart"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">My Cart</h3>
                <p className="text-green-100 text-sm">{cart?.length || 0} items</p>
              </div>
              <span className="text-3xl">🛒</span>
            </div>
            {cart?.length > 0 && (
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold animate-pulse">
                {cart.length}
              </span>
            )}
          </Link>

          <Link
            to="/customer/orders"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Track Orders</h3>
                <p className="text-purple-100 text-sm">{pendingOrders} pending</p>
              </div>
              <span className="text-3xl">📦</span>
            </div>
          </Link>

          <Link
            to="/customer/wishlist"
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Wishlist</h3>
                <p className="text-pink-100 text-sm">{savedItems} saved</p>
              </div>
              <span className="text-3xl">❤️</span>
            </div>
          </Link>
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

        {/* Featured Collection - 8 Products */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-yellow-500">⭐</span>
                Featured Collection
              </h2>
              <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Featured Product 1 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-3xl">🎧</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Wireless Headphones</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Premium sound quality</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">$299.99</span>
                  <span className="text-xs text-yellow-500">⭐ 4.8</span>
                </div>
              </div>

              {/* Featured Product 2 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-3xl">⌚</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Smart Watch Pro</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Track your fitness</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">$449.99</span>
                  <span className="text-xs text-yellow-500">⭐ 4.6</span>
                </div>
              </div>

              {/* Featured Product 3 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-3xl">💻</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Laptop Stand</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Ergonomic design</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">$89.99</span>
                  <span className="text-xs text-yellow-500">⭐ 4.7</span>
                </div>
              </div>

              {/* Featured Product 4 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone Case</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Premium protection</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">$24.99</span>
                  <span className="text-xs text-yellow-500">⭐ 4.5</span>
                </div>
              </div>

              {/* Featured Product 5 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-3xl">⌨️</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Mechanical Keyboard</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">RGB backlit</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">$129.99</span>
                  <span className="text-xs text-yellow-500">⭐ 4.9</span>
                </div>
              </div>

              {/* Featured Product 6 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-3xl">🖱️</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Wireless Mouse</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Precision tracking</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">$59.99</span>
                  <span className="text-xs text-yellow-500">⭐ 4.6</span>
                </div>
              </div>

              {/* Featured Product 7 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-3xl">🎒</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Travel Backpack</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Water resistant</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">$79.99</span>
                  <span className="text-xs text-yellow-500">⭐ 4.8</span>
                </div>
              </div>

              {/* Featured Product 8 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-3xl">🔋</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Power Bank</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">20000mAh capacity</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">$39.99</span>
                  <span className="text-xs text-yellow-500">⭐ 4.7</span>
                </div>
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
                         activity.action === 'Reviewed' ? '⭐' :
                         activity.action === 'Updated Profile' ? '👤' :
                         activity.action === 'Added Address' ? '📍' : '📋'}
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
                         notification.type === 'system' ? '⚙️' :
                         notification.type === 'wishlist' ? '❤️' : '🔔'}
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
                  to="/customer/profile"
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Edit Profile</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Update information</p>
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
                         activity.action === 'Reviewed' ? '⭐' :
                         activity.action === 'Updated Profile' ? '👤' :
                         activity.action === 'Added Address' ? '📍' : '📋'}
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
                         notification.type === 'system' ? '⚙️' :
                         notification.type === 'wishlist' ? '❤️' : '🔔'}
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
