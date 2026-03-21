// frontend/src/pages/Wishlist.js
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { SimpleWishlistContext } from "../context/SimpleWishlistContext";

export default function Wishlist() {
  // Read directly from localStorage to match FoolproofBadges approach
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("simpleWishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading wishlist:", e);
      return [];
    }
  });

  const navigate = useNavigate();

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("simpleWishlist", JSON.stringify(updatedWishlist));
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("simpleWishlist");
  };

  console.log('📋 Wishlist page - wishlist:', wishlist.length);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                clearWishlist();
                console.log('🗑️ Wishlist cleared!');
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 transform hover:scale-105"
          >
            Clear All
          </button>
        )}
      </div>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <FiHeart size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start adding items you love to see them here
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300 transform hover:scale-105"
          >
            <FiHeart size={16} />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item, index) => (
            <div 
              key={item.wishlist_id || item.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <button
                  onClick={() => removeFromWishlist(item.product_id || item.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 transform hover:scale-110"
                >
                  <FiHeart size={14} fill="currentColor" />
                </button>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                {item.name}
              </h3>
              {item.price && (
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                  ${item.price}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/products/${item.product_id || item.id}`)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                >
                  View Details
                </button>
                <button
                  onClick={() => removeFromWishlist(item.product_id || item.id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300 transform hover:scale-105"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}