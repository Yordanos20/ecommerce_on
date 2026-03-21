// frontend/src/pages/CustomerDashboard.js
import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiHeart, FiPackage, FiLogOut, FiUser } from "react-icons/fi";

export default function CustomerDashboard({ darkMode }) {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, wishlist, addToCart, toggleWishlist } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const safeRecentOrders = Array.isArray(recentOrders) ? recentOrders : [];
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // Fetch products & orders
  useEffect(() => {
    // Fetch products
    api.get("/products")
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching products:", err));

    // Fetch user specific orders
    if (user?.id) {
      api.get(`/orders?userId=${user.id}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setRecentOrders(res.data);
          } else if (res.data?.orders) {
            setRecentOrders(res.data.orders);
          } else {
            setRecentOrders([]);
          }
        })
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animated counter component
  const Counter = ({ value }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const duration = 1000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, [value]);
    return <span>{count}</span>;
  };

  const statsCards = [
    { title: "Recent Orders", value: safeRecentOrders.length, icon: <FiPackage size={22} />, color: "bg-purple-500" },
    { title: "Wishlist Items", value: safeWishlist.length, icon: <FiHeart size={22} />, color: "bg-red-500" },
    { title: "Items in Cart", value: safeCartItems.length, icon: <FiShoppingCart size={22} />, color: "bg-blue-500" },
    { title: "Available Products", value: products.length, icon: <FiPackage size={22} />, color: "bg-green-500" }
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 ${darkMode ? "bg-gray-950 text-white" : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"}`}>

      {/* HERO SECTION */}
      <section className="px-6 md:px-12 py-10 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 text-white rounded-b-[40px] shadow-2xl">
        <div className="flex justify-between items-center flex-wrap gap-6">
          {/* Profile Area */}
          <div className="flex items-center gap-5">
            <div ref={dropdownRef} className="relative cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img src={user?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"} alt="profile" className="w-full h-full object-cover hover:scale-110 transition duration-500" />
              </div>

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden right-0 z-50"
                  >
                    <div onClick={() => navigate("/profile")} className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                      <FiUser /> Profile
                    </div>
                    <div onClick={() => navigate("/customer/orders")} className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                      <FiPackage /> Orders
                    </div>
                    <div onClick={() => navigate("/customer/wishlist")} className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                      <FiHeart /> Wishlist
                    </div>
                    <div onClick={() => { logout(); toast.success("Logged out!"); }} className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                      <FiLogOut /> Logout
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{user?.name || "Customer"}</h1>
              <p className="opacity-90 mt-1 text-sm md:text-base">Welcome back! Here’s your dashboard overview.</p>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {statsCards.map((card, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold"><Counter value={card.value} /></div>
                <div className={`p-3 text-white rounded-full ${card.color}`}>{card.icon}</div>
              </div>
              <div className="mt-4 text-gray-600 dark:text-gray-300 font-medium">{card.title}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENT ORDERS */}
      <section className="px-6 md:px-12 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Recent Orders</h2>
        {safeRecentOrders.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
            {safeRecentOrders.map(order => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-w-[250px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="text-gray-500 dark:text-gray-400 text-sm">Order #{order.id}</div>
                <div className="text-xl font-semibold mt-2">${order.total}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(order.date).toLocaleDateString()}</div>
                <div className={`mt-3 text-sm font-medium ${order.status === "Delivered" ? "text-green-500" : "text-yellow-500"}`}>{order.status}</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-gray-500">No recent orders found</div>
        )}
      </section>

      {/* RECOMMENDED PRODUCTS */}
      <section className="px-6 md:px-12 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Recommended Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} wishlist={safeWishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-gray-500">No recommended products available</div>
        )}
      </section>

      <Footer />
    </div>
  );
}