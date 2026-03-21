// frontend/src/components/ProductCard.js
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingBag, FiHeart, FiEye, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { SimpleWishlistContext } from "../context/SimpleWishlistContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function ProductCard({
  product,
  setQuickView = () => {},
  darkMode,
}) {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Get context functions at component level
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(SimpleWishlistContext);
  
  // Global product image overrides - same as landing page
  const productImageOverrides = {
    // Trending Products
    1: 'https://images.pexels.com/photos/3394662/pexels-photo-3394662.jpeg',  // Programming Book
    2: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',  // Shirt
    3: 'https://images.pexels.com/photos/3571094/pexels-photo-3571094.jpeg',  // Smartphones
    4: 'https://images.pexels.com/photos/823841/pexels-photo-823841.jpeg',    // Lamps
    
    // New Arrivals
    5: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg',  // Literature Book
    6: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',            // Laptops
    7: 'https://images.pexels.com/photos/10349969/pexels-photo-10349969.jpeg', // Sportswear
    8: 'https://images.pexels.com/photos/14642652/pexels-photo-14642652.jpeg', // Blankets
    
    // Featured Products
    9: 'https://images.pexels.com/photos/2258083/pexels-photo-2258083.jpeg',   // Finance Books
    10: 'https://images.pexels.com/photos/354939/pexels-photo-354939.jpeg',  // Jeans
    11: 'https://images.pexels.com/photos/2849599/pexels-photo-2849599.jpeg',  // Headphones
    12: 'https://images.pexels.com/photos/6045223/pexels-photo-6045223.jpeg',  // Spiritual Books
    13: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg',  // Vases
    14: 'https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg',  // Desktops
    15: 'https://images.pexels.com/photos/159472/headphones-instagram-video-games-razer-159472.jpeg', // Chair
    16: 'https://images.pexels.com/photos/372326/pexels-photo-372326.jpeg',     // Wall Art
    
    // Recommended Products
    17: 'https://images.pexels.com/photos/4887203/pexels-photo-4887203.jpeg', // Children Books
    18: 'https://images.pexels.com/photos/6769357/pexels-photo-6769357.jpeg', // Jackets
    19: 'https://images.pexels.com/photos/3945659/pexels-photo-3945659.jpeg', // Gaming Consoles
    20: 'https://images.pexels.com/photos/5698918/pexels-photo-5698918.jpeg', // Hats
  };

  const displayImage = productImageOverrides[product.id] || product.image;
  
  // Check if product is in wishlist on mount or when wishlist changes
  useEffect(() => {
    setIsInWishlist(wishlist.some(item => item.id === product.id));
  }, [product.id, wishlist]);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isInWishlist) {
      addToWishlist(product);
    } else {
      removeFromWishlist(product.id);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
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
          src={displayImage}
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
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setQuickView(product); }}
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
            onClick={handleAddToCart}
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