import React, { useState, useEffect } from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

export default function ForceUpdateBadges({ user, isAdmin, isSeller }) {
  // Force update every second to ensure counts are always current
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [updateCounter, setUpdateCounter] = useState(0);

  // Force update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCounter(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update counts whenever counter changes
  useEffect(() => {
    const updateCounts = () => {
      try {
        const wishlistData = localStorage.getItem('simpleWishlist');
        const cartData = localStorage.getItem('cart');
        
        const wishlistCount = wishlistData ? JSON.parse(wishlistData).length : 0;
        const cartCount = cartData ? JSON.parse(cartData).length : 0;
        
        console.log('🔄 Force update - Update #', updateCounter, 'Wishlist:', wishlistCount, 'Cart:', cartCount);
        
        setWishlistCount(wishlistCount);
        setCartCount(cartCount);
      } catch (error) {
        console.error('Force update error:', error);
        setWishlistCount(0);
        setCartCount(0);
      }
    };

    updateCounts();
  }, [updateCounter]);

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
