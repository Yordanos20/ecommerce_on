// frontend/src/components/Navbar.js
import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { FiMenu, FiX, FiSun, FiMoon, FiChevronDown, FiUser, FiBell, FiShoppingCart } from "react-icons/fi";
import axios from "axios";

export default function Navbar({ darkMode, setDarkMode }) {
  const { token, logout, user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isSeller = user?.role?.toLowerCase() === "seller";
  const isCustomer = user?.role?.toLowerCase() === "customer";

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingOrders, setPendingOrders] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Fetch dashboard info
  useEffect(() => {
    if (token && isAdmin) {
      const fetchAdminInfo = async () => {
        try {
          const res = await axios.get("/api/admin/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNotifications(res.data.recentOrders || []);
        } catch (err) {
          console.error("Failed to fetch admin info:", err);
        }
      };
      fetchAdminInfo();
    } else if (token && isSeller) {
      const fetchDashboardInfo = async () => {
        try {
          const res = await axios.get("/api/seller/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPendingOrders(res.data.pendingOrders || 0);
          setNotifications(res.data.notifications || []);
        } catch (err) {
          console.error("Failed to fetch dashboard info:", err);
        }
      };
      fetchDashboardInfo();
    }
  }, [token, user]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    if (isSeller) navigate(`/seller/products?search=${searchQuery}`);
    else navigate(`/products?search=${searchQuery}`);
  };

  const handleDashboardClick = () => {
    if (!user) return navigate("/login");
    if (isAdmin) navigate("/admin/dashboard");
    else if (isSeller) navigate("/seller/dashboard");
    else navigate("/dashboard");
  };

  return (
    <nav className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} shadow-md sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div
            onClick={handleDashboardClick}
            className="text-2xl font-bold text-blue-600 hover:text-blue-500 transition cursor-pointer"
          >
            {isSeller ? "SellerPanel" : isAdmin ? "AdminPanel" : "MyShop"}
          </div>

          {/* Search - Hide for admin users */}
          {!isAdmin && (
            <div className="flex-1 flex justify-center hidden md:flex">
              <div className="flex border rounded-lg overflow-hidden shadow-sm w-full max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={isSeller ? "Search your products..." : "Search products..."}
                  className="px-4 py-2 outline-none w-full text-black"
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition font-semibold"
                >
                  Search
                </button>
              </div>
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">

            {/* Products link for customers */}
            {!isSeller && !isAdmin && (
              <Link
                to="/products"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Products
              </Link>
            )}

            {/* Cart for customers */}
            {!isSeller && !isAdmin && (
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <FiShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {/* Admin notifications */}
            {isAdmin && (
              <div className="relative">
                <FiBell size={20} className="cursor-pointer text-blue-600 dark:text-blue-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {notifications.length}
                  </span>
                )}
              </div>
            )}

            {/* Seller notifications */}
            {isSeller && (
              <div className="relative">
                <FiBell size={20} className="cursor-pointer text-yellow-600 dark:text-yellow-400" />
                {(notifications.length > 0 || pendingOrders > 0) && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {pendingOrders + notifications.length}
                  </span>
                )}
              </div>
            )}

            {/* Profile Dropdown for Admin and Seller */}
            {(isAdmin || isSeller) && token && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 border px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <FiUser className="text-white" size={16} />
                  </div>
                  <span className="hidden md:inline">{user?.name || (isAdmin ? "Admin" : "Seller")}</span>
                  <FiChevronDown size={18} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border rounded-lg shadow-lg overflow-hidden z-50">

                    {/* Admin specific links */}
                    {isAdmin && (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <FiUser /> Admin Dashboard
                        </Link>

                        <Link
                          to="/admin/users"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          👥 User Management
                        </Link>

                        <Link
                          to="/admin/sellers"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          🏪 Seller Management
                        </Link>

                        <Link
                          to="/admin/settings"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          ⚙️ Admin Settings
                        </Link>

                        <hr className="my-2 border-gray-200" />
                      </>
                    )}

                    {/* Common logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                    >
                      � Logout
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}