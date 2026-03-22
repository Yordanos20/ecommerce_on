// frontend/src/components/NavbarFixed.js
import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { SimpleWishlistContext } from "../context/SimpleWishlistContext";
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiHeadphones, FiStar, FiHeart, FiShoppingCart, FiEye, FiChevronLeft, FiChevronRight, FiZap, FiClock, FiSun, FiMoon, FiUser, FiLogOut, FiSettings, FiBell, FiX, FiMenu, FiSearch, FiLayout, FiPackage, FiChevronDown, FiHome, FiGrid } from "react-icons/fi";
import FoolproofBadges from "./FoolproofBadges";

export default function NavbarFixed({ darkMode, setDarkMode }) {
  const { user, logout, notifications } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlist } = useContext(SimpleWishlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  // Use context values directly
  const cartCount = cartItems.length;
  const wishlistCount = wishlist.length;
  const unreadCount = (notifications || []).filter(n => !n.is_read).length;

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (isAdmin) {
        // Admin search - navigate to admin dashboard with search parameter
        navigate(`/admin/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
      } else if (isSeller) {
        // Seller search - navigate to seller products
        navigate(`/seller/products?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        // Customer search - navigate to products
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      }
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    const role = user.role?.toLowerCase();
    if (role === "admin") return "/admin/dashboard";
    if (role === "seller") return "/seller/dashboard";
    return "/"; // Customer goes to landing page
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isSeller = user?.role?.toLowerCase() === "seller";
  const isCustomer = user?.role?.toLowerCase() === "customer";

  const navLinks = [
    { label: "Home", to: user ? getDashboardLink() : "/", icon: <FiShoppingBag size={16} /> },
    { label: "Products", to: "/products", icon: <FiGrid size={16} /> },
  ];

  // Filter navLinks for admin users - show no navigation links
  const filteredNavLinks = isAdmin ? [] : navLinks;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-surface-700/50"
            : "bg-white dark:bg-surface-900 border-b border-gray-100 dark:border-surface-800"
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link to={user ? getDashboardLink() : "/"} className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <FiShoppingBag className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">
                {isAdmin ? "AdminPanel" : isSeller ? "SellerPanel" : (
                  <>Market<span className="text-primary-600 dark:text-primary-400">Place</span></>
                )}
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1 ml-8">
              {filteredNavLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isAdmin ? "Search users, orders, products, sellers..." : "Search products..."}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-surface-800 border border-transparent focus:border-primary-300 dark:focus:border-primary-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none transition-all focus:bg-white dark:focus:bg-surface-700 focus:shadow-lg focus:shadow-primary-500/10"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all"
                title="Toggle dark mode"
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* Foolproof Cart & Wishlist Badges */}
              <FoolproofBadges user={user} isAdmin={isAdmin} isSeller={isSeller} />

              {/* User / Auth */}
              {user ? (
                <div ref={profileRef} className="relative ml-1">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-800 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                      {user.name?.split(" ")[0]}
                    </span>
                    <FiChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 glass-card py-2 shadow-elevated animate-slide-down z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-surface-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to={user.role?.toLowerCase() === "customer" ? "/customer" : getDashboardLink()}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors"
                        >
                          <FiLayout size={16} /> Dashboard
                        </Link>

                        {user.role?.toLowerCase() === "customer" && (
                          <>
                            <Link
                              to="/customer/orders"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors"
                            >
                              <FiPackage size={16} /> My Orders
                            </Link>
                            <Link
                              to="/customer/profile"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors"
                            >
                              <FiUser size={16} /> Profile
                            </Link>
                          </>
                        )}

                        <Link
                          to="/customer?section=notifications"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors"
                        >
                          <FiBell size={16} />
                          Notifications
                          {unreadCount > 0 && (
                            <span className="ml-auto px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 dark:border-surface-700 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <FiLogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-1">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary !py-2 !px-4 !text-sm !rounded-xl !shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all ml-1"
              >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-surface-800 bg-white dark:bg-surface-900 animate-slide-down">
            <div className="section-container py-4 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="md:hidden">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={isAdmin ? "Search users, orders, products, sellers..." : "Search products..."}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-surface-800 rounded-xl text-sm outline-none text-gray-900 dark:text-gray-100"
                  />
                </div>
              </form>

              {filteredNavLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.to
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-800"
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}

              {user && (
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-800"
                >
                  <FiLayout size={16} /> Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16 lg:h-[72px]" />
    </>
  );
}
