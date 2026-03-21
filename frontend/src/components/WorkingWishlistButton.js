import React, { useContext, useState, useEffect } from 'react';
import { SimpleWishlistContext } from '../context/SimpleWishlistContext';
import { toast } from 'react-toastify';

export default function WorkingWishlistButton({ product }) {
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(SimpleWishlistContext);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if product is already in wishlist
  useEffect(() => {
    const inWishlist = wishlist.some(item => item.id === product.id);
    setIsInWishlist(inWishlist);
  }, [wishlist, product.id]);

  const handleClick = (e) => {
    console.log(' WORKING WISHLIST BUTTON CLICKED!');
    console.log(' Product:', product);
    console.log(' Current wishlist:', wishlist);
    
    if (!isInWishlist) {
      // Add to wishlist using context
      addToWishlist(product);
      setIsInWishlist(true);
      
      // Enhanced visual feedback
      if (e && e.currentTarget) {
        const button = e.currentTarget;
        button.classList.add('scale-110');
        setTimeout(() => button.classList.remove('scale-110'), 200);
      }
      
      console.log('🔴 ADDED TO WISHLIST!');
      
    } else {
      // Remove from wishlist using context
      removeFromWishlist(product.id);
      setIsInWishlist(false);
      
      // Enhanced visual feedback
      if (e && e.currentTarget) {
        const button = e.currentTarget;
        button.classList.add('scale-95');
        setTimeout(() => button.classList.remove('scale-95'), 200);
      }
      
      console.log(' REMOVED FROM WISHLIST!');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        isInWishlist 
          ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100 shadow-red-200' 
          : 'border-gray-300 hover:bg-gray-50 hover:border-red-300 hover:text-red-500'
      }`}
      style={{ fontSize: '20px' }}
    >
      <span className={`inline-block transition-all duration-300 ${isInWishlist ? 'animate-pulse' : ''}`}>
        {isInWishlist ? '❤️' : '🤍'}
      </span>
    </button>
  );
}
