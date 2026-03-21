// frontend/src/components/FeaturedProducts.js
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function FeaturedProducts({ darkMode, title = "Featured Products", subtitle = "Handpicked selections just for you" }) {
  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      const allProducts = Array.isArray(data) ? data : (data.products || []);
      
      // Get featured products or random selection
      const featured = allProducts
        .filter(p => Number(p.isFeatured) === 1 || Math.random() > 0.7)
        .slice(0, 8);

      setProducts(featured);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart!`);
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some((w) => w.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const renderStars = (rating = 4) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - rating < 1) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  const ProductCard = ({ product }) => {
    const isInWishlist = wishlist.some((w) => w.id === product.id);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className={`group ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden`}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <Link to={`/products/${product.id}`}>
            <img
              src={product.image || "https://via.placeholder.com/300x300"}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          
          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute top-2 right-2 p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:scale-110 transition-transform duration-200`}
          >
            <svg
              className={`w-5 h-5 ${isInWishlist ? "text-red-500 fill-current" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>

          {/* Badges */}
          {product.isSale && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Sale
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <Link to={`/products/${product.id}`}>
            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? "text-white" : "text-gray-900"} group-hover:text-blue-600 transition-colors duration-200 line-clamp-2`}>
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          {product.description && (
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm mb-2 line-clamp-2`}>
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} ml-1`}>
              ({product.rating || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} line-through ml-2`}>
                  ${product.oldPrice}
                </span>
              )}
            </div>
            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Stock: {product.stock || 0}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(product)}
            disabled={!product.stock || product.stock === 0}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
              !product.stock || product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {!product.stock || product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <svg className="animate-spin w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-white"} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}>
              {title}
            </h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {subtitle}
            </p>
          </div>
          <Link
            to="/products"
            className={`text-blue-600 hover:text-blue-700 font-medium flex items-center`}
          >
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p>No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}