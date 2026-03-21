import React, { useContext } from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { SimpleWishlistContext } from '../context/SimpleWishlistContext';

export default function FoolproofBadges({ user, isAdmin, isSeller }) {
  const { cartItems } = useContext(CartContext);
  const { wishlist } = useContext(SimpleWishlistContext);

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  console.log('🛡️ FoolproofBadges - Context counts:', { wishlistCount, cartCount });

  return (
    <>
      {/* Wishlist Button */}
      <Link
        to={user ? "/wishlist" : "/login"}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-300 transform hover:scale-105 relative group"
      >
        <FiHeart 
          size={18} 
          className="transition-all duration-300 group-hover:scale-110 group-hover:text-red-500"
        />
        {wishlistCount > 0 && (
          <span 
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)',
              animation: 'bounce 1s infinite'
            }}
          >
            {wishlistCount > 9 ? "9+" : wishlistCount}
          </span>
        )}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Wishlist
        </span>
      </Link>

      {/* Cart Button */}
      <Link
        to="/cart"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-300 transform hover:scale-105 relative group"
      >
        <FiShoppingCart 
          size={18} 
          className="transition-all duration-300 group-hover:scale-110 group-hover:text-blue-500"
        />
        {cartCount > 0 && (
          <span 
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '20px',
              height: '20px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)'
            }}
          >
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
          Cart
        </span>
      </Link>
    </>
  );
}
