// frontend/src/pages/CustomerDashboardNew.js
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContextFixed";
import { toast } from "react-toastify";

export default function CustomerDashboardNew({ darkMode, setDarkMode }) {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  const profileRef = React.useRef();

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

  // Fetch customer orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/orders/customer", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: "👤", label: "My Profile", path: "/customer/profile" },
    { icon: "📦", label: "My Orders", path: "/customer/orders" },
    { icon: "❤️", label: "Wishlist", path: "/customer/wishlist" },
    { icon: "🛒", label: "Cart", path: "/cart", badge: cart?.length || 0 },
    { icon: "📍", label: "Saved Addresses", path: "/customer/shipping" },
    { icon: "💳", label: "Payment Methods", path: "/customer/payment" },
    { icon: "🔔", label: "Notifications", path: "/customer/notifications" },
    { icon: "🆘", label: "Help Center", path: "/customer/support" },
    { icon: "⚙️", label: "Settings", path: "/customer/settings" },
    { icon: "🚪", label: "Logout", action: handleLogout, danger: true },
  ];

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const completedOrders = orders.filter(order => order.status === "delivered").length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Customer Navbar */}
      <nav className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-500">
              MyShop
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Products
              </Link>
              <Link to="/customer/orders" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Orders
              </Link>
              <Link to="/customer/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Wishlist
              </Link>
            </div>

            {/* Right Side - Profile Dropdown */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {cart?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {menuItems.map((item, index) => (
                        <div key={index}>
                          {item.action ? (
                            <button
                              onClick={item.action}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 ${
                                item.danger ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              <span className="text-xl">{item.icon}</span>
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          ) : (
                            <Link
                              to={item.path}
                              className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                            >
                              <span className="text-xl">{item.icon}</span>
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          )}
                          {index < menuItems.length - 1 && (
                            <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                          )}
                        </div>
                      ))}
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's what's happening with your orders and account.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Completed Orders</p>
                <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Spent</p>
                <p className="text-2xl font-bold text-purple-600">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <Link to="/customer/orders" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Orders
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                      <p className="font-semibold text-lg mt-2">
                        ${order.total_amount || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You haven't placed any orders yet
              </p>
              <Link
                to="/products"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
