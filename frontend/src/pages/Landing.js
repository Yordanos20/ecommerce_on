// frontend/src/pages/Landing.js
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { FiShoppingBag, FiHeart, FiStar, FiZap, FiClock, FiGrid, FiChevronDown, FiArrowRight, FiChevronLeft, FiChevronRight, FiTruck, FiShield, FiHeadphones, FiEye } from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { localStorageHelper } from "../utils/localStorageHelper";
import { SimpleWishlistContext } from "../context/SimpleWishlistContext";
import { WishlistContext } from "../context/WishlistContext";
import Footer from "../components/Footer";

const API = "https://ecommerce-backend-ol0h.onrender.com/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

// ========================================
// HERO SECTION
// ========================================
function HeroSection({ darkMode }) {
  const slides = [
    {
      title: "Discover Premium Products",
      subtitle: "Shop the latest trends from top sellers worldwide",
      cta: "Shop Now",
      link: "/products",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
      gradient: "from-primary-600 via-primary-700 to-indigo-900"
    },
    {
      title: "New Season Arrivals",
      subtitle: "Explore fresh collections with amazing deals",
      cta: "Explore Collection",
      link: "/products?new=true",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      gradient: "from-violet-600 via-purple-700 to-purple-900"
    },
    {
      title: "Flash Sale Event",
      subtitle: "Up to 50% off on selected items — limited time!",
      cta: "Grab Deals",
      link: "/products?sale=true",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      gradient: "from-rose-600 via-pink-700 to-fuchsia-900"
    }
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden h-[600px] lg:h-[700px]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ${i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-90`} />
          <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 section-container h-full flex items-center">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-sm font-medium mb-6">
            <FiZap className="text-yellow-300" /> Trending Now
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            {slides[current].title}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg">
            {slides[current].subtitle}
          </p>
          <div className="flex gap-4">
            <Link
              to={slides[current].link}
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-elevated hover:shadow-2xl transform hover:-translate-y-1"
            >
              {slides[current].cta} <FiArrowRight />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Browse All
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrent(p => (p - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={() => setCurrent(p => (p + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <FiChevronRight size={24} />
      </button>
    </section>
  );
}

// ========================================
// TRUST BADGES
// ========================================
function TrustBadges() {
  const badges = [
    { icon: <FiTruck size={24} />, title: "Free Shipping", desc: "On orders over $50" },
    { icon: <FiShield size={24} />, title: "Secure Payment", desc: "100% protected" },
    { icon: <FiHeadphones size={24} />, title: "24/7 Support", desc: "Dedicated help" },
    { icon: <FiShoppingBag size={24} />, title: "Easy Returns", desc: "30-day policy" },
  ];

  return (
    <section className="section-container -mt-10 relative z-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            custom={i}
            className="glass-card p-5 flex items-center gap-4 group hover:shadow-card-hover transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              {badge.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{badge.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{badge.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ========================================
// CATEGORIES
// ========================================
function CategoriesSection({ darkMode }) {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    axios.get(`${API}/categories`).then(async r => {
      setCategories(r.data);
      
      // Get product counts for each category
      const counts = {};
      const categoriesArray = Array.isArray(r.data) ? r.data : [];
      for (const cat of categoriesArray) {
        try {
          const productsRes = await axios.get(`${API}/products?category=${cat.slug}`);
          const products = productsRes.data.products || productsRes.data || [];
          counts[cat.id] = products.length;
        } catch {
          counts[cat.id] = 0;
        }
      }
      setProductCounts(counts);
    }).catch(() => {});
  }, []);

  const categoryImages = {
    'electronics': 'https://images.pexels.com/photos/5946/books-yellow-book-reading.jpg',
    'fashion': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    'cloth': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    'clothing': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    'clothes': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    'apparel': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    'books': 'https://images.pexels.com/photos/17111837/pexels-photo-17111837.jpeg',
    'home': 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
    'home-living': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80',
    'sports': 'https://images.unsplash.com/photo-1461896836934-bd45ba8bcd39?w=400&q=80',
    'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  };

  const parentCats = (Array.isArray(categories) ? categories : []).filter(c => !c.parent_id).slice(0, 4);
  
  // Debug: Log category slugs to see what they actually are
  console.log('🔍 Category slugs:', parentCats.map(cat => ({ name: cat.name, slug: cat.slug })));

  return (
    <section className="section-container py-16">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-square rounded-2xl bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {parentCats.map((cat, i) => (
              <motion.div key={cat.id} variants={fadeUp} custom={i}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="group block text-center"
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-surface-800 dark:to-surface-700">
                    <img
                      src={cat.image || categoryImages[cat.slug] || `https://via.placeholder.com/400?text=${cat.name}`}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

// ========================================
// PRODUCT CARD
// ========================================
function ProductCardLanding({ product, darkMode }) {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Get context functions at component level
  const { addToCart: contextAddToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist } = useContext(SimpleWishlistContext);
  
  // Context-based addToCart function
  const addToCart = (productToAdd) => {
    try {
      console.log('🛒 Landing page addToCart called with:', productToAdd);
      
      contextAddToCart(productToAdd);
      
      console.log('🛒 Landing page - Added item using context');
      toast.success(`${productToAdd.name} added to cart!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };
  
  // Check if product is in wishlist on mount
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('simpleWishlist') || '[]');
    setIsInWishlist(savedWishlist.some(item => item.id === product.id));
  }, [product.id]);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    console.log('🛒 Landing page wishlist clicked:', product);
    
    if (!isInWishlist) {
      // Add to wishlist using context
      addToWishlist(product);
      setIsInWishlist(true);
      
      console.log('🛒 Added to wishlist from landing page using context');
    } else {
      // Remove from wishlist using context
      removeFromWishlist(product.id);
      setIsInWishlist(false);
      
      console.log('🛒 Removed from wishlist from landing page using context');
    }
  };
  
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.discount_price / product.price) * 100) : 0;

  return (
    <motion.div
      variants={fadeUp}
      className="group glass-card-hover overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-surface-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew === 1 && (
            <span className="px-2.5 py-1 bg-primary-500 text-white text-xs font-bold rounded-lg">NEW</span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">-{discountPercent}%</span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
            className="w-9 h-9 rounded-full bg-white dark:bg-surface-800 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={handleWishlistClick}
            className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
              isInWishlist 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200' 
                : 'bg-white dark:bg-surface-800 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 hover:shadow-red-200'
            }`}
          >
            <FiHeart 
              size={16} 
              className={`transition-all duration-300 ${isInWishlist ? 'animate-pulse' : ''}`}
              fill={isInWishlist ? 'currentColor' : 'none'} 
            />
          </button>
        </div>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <FiShoppingBag size={16} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <Link to={`/products/${product.id}`} className="block p-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{product.category || "General"}</p>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, j) => (
            <FiStar
              key={j}
              size={12}
              className={j < Math.round(Number(product.rating) || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">{Number(product.rating || 0).toFixed(1)} ({product.review_count || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ETB {Number((hasDiscount ? product.discount_price || 0 : product.price || 0) * 55).toFixed(2)}
          </span>
          {hasDiscount && (
            <p className="text-sm text-gray-400 line-through">ETB {Number((product.price || 0) * 55).toFixed(2)}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ========================================
// PRODUCTS SECTION
// ========================================
function ProductsSection({ title, subtitle, products, darkMode }) {
  const getSectionIcon = (title) => {
    if (title.includes("Trending")) return <FiZap className="text-orange-500" />;
    if (title.includes("New")) return <FiClock className="text-green-500" />;
    if (title.includes("Featured")) return <FiStar className="text-yellow-500" />;
    if (title.includes("Recommended")) return <FiHeart className="text-red-500" />;
    return <FiShoppingBag className="text-blue-500" />;
  };

  return (
    <section className="section-container py-16">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
              {getSectionIcon(title)}
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
              <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:gap-3 transition-all"
          >
            View All <FiArrowRight />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, i) => (
            <motion.div key={product.id} variants={fadeUp} custom={i}>
              <ProductCardLanding product={product} darkMode={darkMode} />
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            View All Products <FiArrowRight />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ========================================
// PROMOTIONAL BANNER
// ========================================
function PromoBanner() {
  return (
    <section className="section-container py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 p-8 md:p-12"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-white text-sm font-medium rounded-full mb-4">
              <FiClock size={14} /> Limited Time Offer
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Flash Sale — Up to 50% Off!</h3>
            <p className="text-white/70 max-w-md">Don't miss out on incredible deals. Shop now before they're gone!</p>
          </div>
          <Link
            to="/products?sale=true"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-elevated transform hover:-translate-y-1 whitespace-nowrap"
          >
            Shop Sale <FiArrowRight />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ========================================
// NEWSLETTER
// ========================================
function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/newsletter`, { email });
      setSubmitted(true);
      setEmail("");
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <section className="bg-gradient-to-b from-transparent to-gray-50 dark:to-surface-900 py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Stay in the Loop</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Subscribe to our newsletter for exclusive deals, new arrivals, and more.
          </p>

          {submitted ? (
            <div className="glass-card p-6 text-center">
              <p className="text-accent-600 dark:text-accent-400 font-semibold">🎉 Thanks for subscribing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="input-field flex-1 !rounded-2xl"
              />
              <button type="submit" className="btn-primary !rounded-2xl whitespace-nowrap">
                Subscribe <FiArrowRight className="inline ml-2" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ========================================
// ========================================
export default function Landing({ darkMode, setDarkMode }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Get context to trigger re-render when cart/wishlist changes
  const { cartItems } = useContext(CartContext);
  const { wishlist } = useContext(SimpleWishlistContext);

  console.log('🏠 Landing page render - products:', products.length, 'cartItems:', cartItems.length, 'wishlist:', wishlist.length);

  useEffect(() => {
    console.log('🏠 Landing page - fetching products');
    axios.get(`${API}/products`)
      .then(r => {
        const data = r.data.products || r.data || [];
        console.log('🏠 Landing page - fetched products:', data.length);
        console.log('🏠 Sample product:', data[0]);
        setProducts(data);
      })
      .catch(err => {
        console.error('🏠 Error fetching products:', err);
        // Fallback to sample products if API fails
        const fallbackProducts = [
          { id: 1, name: "Laptop Pro", price: "1299.99", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", rating: 4.5 },
          { id: 2, name: "Wireless Headphones", price: "199.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", rating: 4.2 },
          { id: 3, name: "Smart Watch", price: "299.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", rating: 4.0 },
          { id: 4, name: "Running Shoes", price: "89.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", rating: 4.3 },
          { id: 5, name: "Coffee Maker", price: "149.99", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", rating: 4.1 }
        ];
        setProducts(fallbackProducts);
        toast.warning('Using sample products - API connection issue');
      })
      .finally(() => setLoading(false));
  }, []);

  // Create specific product arrays for each section based on your requirements (now with all 20 products)
  
  // Trending product image overrides
  const trendingProductImages = {
    1: 'https://images.pexels.com/photos/3394662/pexels-photo-3394662.jpeg',  // Programming Book
    2: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',  // Shirt
    3: 'https://images.pexels.com/photos/3571094/pexels-photo-3571094.jpeg',  // Smartphones
    4: 'https://images.pexels.com/photos/823841/pexels-photo-823841.jpeg',    // Lamps
  };

  // New Arrivals product image overrides
  const newArrivalsImages = {
    5: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg',  // Literature Book
    6: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',            // Laptops
    7: 'https://images.pexels.com/photos/10349969/pexels-photo-10349969.jpeg', // Sportswear
    8: 'https://images.pexels.com/photos/14642652/pexels-photo-14642652.jpeg', // Blankets
  };

  // Featured Products image overrides
  const featuredProductImages = {
    9: 'https://images.pexels.com/photos/2258083/pexels-photo-2258083.jpeg',   // Finance Books
    10: 'https://images.pexels.com/photos/354939/pexels-photo-354939.jpeg',  // Jeans
    11: 'https://images.pexels.com/photos/2849599/pexels-photo-2849599.jpeg',  // Headphones
    12: 'https://images.pexels.com/photos/6045223/pexels-photo-6045223.jpeg',  // Spiritual Books
    13: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg',  // Vases
    14: 'https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg',  // Desktops
    15: 'https://images.pexels.com/photos/159472/headphones-instagram-video-games-razer-159472.jpeg', // Chair
    16: 'https://images.pexels.com/photos/372326/pexels-photo-372326.jpeg',     // Wall Art
  };

  // Recommended Products image overrides
  const recommendedProductImages = {
    17: 'https://images.pexels.com/photos/4887203/pexels-photo-4887203.jpeg', // Children Books
    18: 'https://images.pexels.com/photos/6769357/pexels-photo-6769357.jpeg', // Jackets
    19: 'https://images.pexels.com/photos/3945659/pexels-photo-3945659.jpeg', // Gaming Consoles
    20: 'https://images.pexels.com/photos/5698918/pexels-photo-5698918.jpeg', // Hats
  };

  const trendingProducts = products.filter(p => 
    [1, 2, 3, 4].includes(p.id) // Programming Book, Shirt, Smartphones, Lamps
  ).map(product => ({
    ...product,
    image: trendingProductImages[product.id] || product.image
  }));
  
  const newArrivals = products.filter(p => 
    [5, 6, 7, 8].includes(p.id) // Literature Book, Laptops, Sportswear, Blankets
  ).map(product => ({
    ...product,
    image: newArrivalsImages[product.id] || product.image
  }));
  
  const featuredProducts = products.filter(p => 
    [9, 10, 11, 12, 13, 14, 15, 16].includes(p.id) // Finance Books, Jeans, Headphones, Spiritual Books, Vases, Desktops, Chair, Wall Art (8 products)
  ).map(product => ({
    ...product,
    image: featuredProductImages[product.id] || product.image
  }));
  
  const recommendedProducts = products.filter(p => 
    [17, 18, 19, 20].includes(p.id) // Children Books, Jackets, Gaming Consoles, Hats
  ).map(product => ({
    ...product,
    image: recommendedProductImages[product.id] || product.image
  }));

  console.log('🏠 Product sections:', {
    trending: trendingProducts.length,
    newArrivals: newArrivals.length,
    featured: featuredProducts.length,
    recommended: recommendedProducts.length
  });

  return (
    <div className="min-h-screen">
      <HeroSection darkMode={darkMode} />
      <TrustBadges />
      <CategoriesSection darkMode={darkMode} />

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <ProductsSection
          key="trending"
          title="Trending Products"
          subtitle="Hot items everyone is talking about"
          products={trendingProducts}
          darkMode={darkMode}
        />
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <ProductsSection
          key="new-arrivals"
          title="New Arrivals"
          subtitle="The latest additions to our store"
          products={newArrivals}
          darkMode={darkMode}
        />
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <ProductsSection
          key="featured"
          title="Featured Products"
          subtitle="Handpicked items just for you"
          products={featuredProducts}
          darkMode={darkMode}
        />
      )}

      {/* Recommended Products */}
      <ProductsSection
        key="recommended"
        title="Recommended for You"
        subtitle="Products we think you'll love"
        products={recommendedProducts}
        darkMode={darkMode}
      />

      <Newsletter />
      <Footer darkMode={darkMode} />
    </div>
  );
}
