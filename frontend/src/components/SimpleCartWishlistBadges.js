import React from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

export default function SimpleCartWishlistBadges({ user, isAdmin, isSeller }) {
  // Get counts directly from localStorage - no React state, no hooks, just pure functions
  const getWishlistCount = () => {
    try {
      const data = localStorage.getItem('simpleWishlist');
      if (!data) return 0;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch (error) {
      console.error('Wishlist count error:', error);
      return 0;
    }
  };

  const getCartCount = () => {
    try {
      const data = localStorage.getItem('cart');
      if (!data) return 0;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch (error) {
      console.error('Cart count error:', error);
      return 0;
    }
  };

  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();

  console.log('🔥 SIMPLE BADGES - Wishlist:', wishlistCount, 'Cart:', cartCount);

  // Hide for admin and seller users
  if (isAdmin || isSeller) {
    return null;
  }

  return (
    <>
      {/* Wishlist Button */}
      <a
        href={user ? "/wishlist" : "/login"}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-300 transform hover:scale-105 relative group"
      >
        <FiHeart 
          size={18} 
          className="transition-all duration-300 group-hover:scale-110 group-hover:text-red-500"
        />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 animate-bounce">
            {wishlistCount > 9 ? "9+" : wishlistCount}
          </span>
        )}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Wishlist
        </span>
      </a>

      {/* Cart Button */}
      <a
        href="/cart"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all relative"
      >
        <FiShoppingCart size={18} />
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-primary-500/40">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </a>
    </>
  );
}
