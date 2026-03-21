// frontend/src/pages/LandingProfessional.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { toast } from "react-toastify";

export default function LandingProfessional() {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock professional data
  const mockProducts = [
    // New Arrivals (4 products)
    { id: 1, name: "Premium Wireless Headphones", price: 299.99, rating: 4.8, category: "Electronics", image: "https://images.pexels.com/photos/3780681/pexels-photo.jpg", isNew: true, stock: 15, description: "Premium noise-cancelling wireless headphones with 30-hour battery life." },
    { id: 2, name: "Smart Watch Pro", price: 449.99, rating: 4.6, category: "Electronics", image: "https://images.pexels.com/photos/437037/pexels-photo.jpg", isNew: true, stock: 8, description: "Advanced fitness tracking and health monitoring smartwatch." },
    { id: 3, name: "Laptop Backpack", price: 89.99, rating: 4.5, category: "Accessories", image: "https://images.pexels.com/photos/1089438/pexels-photo.jpg", isNew: true, stock: 25, description: "Water-resistant laptop backpack with USB charging port." },
    { id: 4, name: "Wireless Mouse", price: 59.99, rating: 4.7, category: "Electronics", image: "https://images.pexels.com/photos/3945681/pexels-photo.jpg", isNew: true, stock: 30, description: "Ergonomic wireless mouse with precision tracking." },
    
    // Featured Products (8 products)
    { id: 5, name: "4K Webcam", price: 179.99, rating: 4.9, category: "Electronics", image: "https://images.pexels.com/photos/3844768/pexels-photo.jpg", isNew: false, stock: 12, description: "Professional 4K webcam with auto-focus." },
    { id: 6, name: "Mechanical Keyboard", price: 129.99, rating: 4.8, category: "Electronics", image: "https://images.pexels.com/photos/1779487/pexels-photo.jpg", isNew: false, stock: 18, description: "RGB mechanical keyboard with cherry switches." },
    { id: 7, name: "Desk Organizer", price: 34.99, rating: 4.3, category: "Office", image: "https://images.pexels.com/photos/6678387/pexels-photo.jpg", isNew: false, stock: 40, description: "Bamboo desk organizer with multiple compartments." },
    { id: 8, name: "Phone Stand", price: 24.99, rating: 4.6, category: "Accessories", image: "https://images.pexels.com/photos/18105/pexels-photo.jpg", isNew: false, stock: 50, description: "Adjustable aluminum phone stand for desk use." },
    { id: 9, name: "USB-C Hub", price: 79.99, rating: 4.7, category: "Electronics", image: "https://images.pexels.com/photos/2582937/pexels-photo.jpg", isNew: false, stock: 22, description: "7-in-1 USB-C hub with HDMI and SD card reader." },
    { id: 10, name: "Yoga Mat", price: 45.99, rating: 4.8, category: "Sports", image: "https://images.pexels.com/photos/4056723/pexels-photo.jpg", isNew: false, stock: 35, description: "Non-slip yoga mat with carrying strap." },
    { id: 11, name: "Water Bottle", price: 19.99, rating: 4.5, category: "Sports", image: "https://images.pexels.com/photos/4056723/pexels-photo.jpg", isNew: false, stock: 60, description: "Insulated stainless steel water bottle." },
    { id: 12, name: "Running Shoes", price: 119.99, rating: 4.7, category: "Sports", image: "https://images.pexels.com/photos/276517/pexels-photo.jpg", isNew: false, stock: 20, description: "Lightweight running shoes with cushioned sole." }
  ];

  const categories = [
    { title: "Electronics", image: "https://images.pexels.com/photos/3780681/pexels-photo.jpg" },
    { title: "Fashion", image: "https://images.pexels.com/photos/291862/pexels-photo.jpg" },
    { title: "Home", image: "https://images.pexels.com/photos/186077/pexels-photo.jpg" },
    { title: "Sports", image: "https://images.pexels.com/photos/4056723/pexels-photo.jpg" }
  ];

  useEffect(() => {
    // Simulate loading professional products
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/products?category=${category}`);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const toggleWishlist = (productId) => {
    if (wishlist.some(item => item.id === productId)) {
      removeFromWishlist(productId);
      toast.info("Removed from wishlist");
    } else {
      const product = products.find(p => p.id === productId);
      if (product) {
        addToWishlist(product);
        toast.success("Added to wishlist");
      }
    }
  };

  // Filter products for display
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const featuredProducts = products.filter(p => !p.isNew).slice(0, 8);
  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} flex flex-col min-h-screen transition-all duration-300`}>
      
      {/* Professional Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-6">
                Discover Premium Products
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Shop the latest electronics, fashion, and lifestyle products with fast delivery and secure payment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/products")}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
                >
                  Shop Now
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                  Learn More
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src="https://images.pexels.com/photos/3945681/pexels-photo.jpg"
                alt="Hero"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full px-6 py-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <button
              onClick={() => searchQuery.trim() && navigate(`/products?search=${searchQuery}`)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Shop by Category
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleCategoryClick(cat.title)}
                className="cursor-pointer group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-white text-xl font-bold p-6">{cat.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals - 4 Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold flex items-center gap-3"
            >
              <span className="text-green-500">🆕</span>
              New Arrivals
            </motion.h2>
            <Link
              to="/products?filter=new"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {newArrivals.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    New
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                    >
                      {wishlist.some(item => item.id === product.id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-yellow-500">{"⭐".repeat(Math.round(product.rating))}</div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">({product.rating})</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Stock: {product.stock}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-through">${(product.price * 1.2).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => { addToCart(product); toast.success(`${product.name} added to cart!`); }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - 8 Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold flex items-center gap-3"
            >
              <span className="text-yellow-500">⭐</span>
              Featured Products
            </motion.h2>
            <Link
              to="/products?filter=featured"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                    >
                      {wishlist.some(item => item.id === product.id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-yellow-500">{"⭐".repeat(Math.round(product.rating))}</div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">({product.rating})</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Stock: {product.stock}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-through">${(product.price * 1.15).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => { addToCart(product); toast.success(`${product.name} added to cart!`); }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Premium Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30-Day</div>
              <div className="text-blue-100">Money Back Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={() => setQuickView(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-2xl w-full flex flex-col md:flex-row gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-1/2">
                <img
                  src={quickView.image}
                  alt={quickView.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <div className="md:w-1/2 flex flex-col gap-4">
                <h3 className="text-2xl font-bold">{quickView.name}</h3>
                <p className="text-xl font-semibold text-blue-600">${quickView.price}</p>
                <p>{quickView.description}</p>
                <p className="text-yellow-500">⭐ {quickView.rating} / 5</p>
                <p className="text-sm">Stock: {quickView.stock}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { addToCart(quickView); toast.success(`${quickView.name} added to cart!`); setQuickView(null); }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => toggleWishlist(quickView.id)}
                    className={`flex-1 border py-2 rounded-lg ${wishlist.some(item => item.id === quickView.id) ? "text-red-500" : "text-gray-700"}`}
                  >
                    {wishlist.some(item => item.id === quickView.id) ? "❤️ Wishlist" : "♡ Wishlist"}
                  </button>
                </div>

                <button
                  onClick={() => setQuickView(null)}
                  className="mt-4 bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
