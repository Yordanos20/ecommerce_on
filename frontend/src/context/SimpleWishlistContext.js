import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

// Create context
export const SimpleWishlistContext = createContext();

// Provider component
export const SimpleWishlistProvider = ({ children }) => {
  // Wishlist items - use localStorage as fallback
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("simpleWishlist");
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.log("No saved wishlist found", error);
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    console.log('📋 SimpleWishlistContext - saving to localStorage:', wishlist);
    localStorage.setItem("simpleWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add product to wishlist
  const addToWishlist = (product) => {
    try {
      console.log('🛒 Simple wishlist - adding:', product);
      console.log('🛒 Current wishlist:', wishlist);
      
      // Check if product already exists
      const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);
      console.log('🛒 Already in wishlist:', isAlreadyInWishlist);
      
      if (!isAlreadyInWishlist) {
        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        console.log('🛒 New wishlist set:', newWishlist);
        
        // Test toast notification
        console.log('🔔 Attempting to show toast...');
        toast.success(`${product.name || 'Product'} added to wishlist! ❤️`);
        console.log('✅ Toast called successfully');
        
        // Also show a console notification as backup
        console.log(`🎉 SUCCESS: ${product.name || 'Product'} added to wishlist! ❤️`);
      } else {
        toast.info('Product already in wishlist');
        console.log('ℹ️ Product already in wishlist');
      }
    } catch (error) {
      console.error('❌ Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    try {
      console.log('🗑️ Simple wishlist - removing:', productId);
      console.log('🗑️ Current wishlist:', wishlist);
      
      const updatedWishlist = wishlist.filter(item => item.id !== productId);
      console.log('🗑️ Updated wishlist:', updatedWishlist);
      
      setWishlist(updatedWishlist);
      console.log('🗑️ Wishlist state updated');
      
      // Test toast notification
      console.log('🔔 Attempting to show remove toast...');
      toast.success('Removed from wishlist! 🗑️');
      console.log('✅ Remove toast called successfully');
      
      // Also show a console notification as backup
      console.log('🎉 SUCCESS: Removed from wishlist! 🗑️');
    } catch (error) {
      console.error('❌ Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("simpleWishlist");
    toast.success('Wishlist cleared! 🗑️');
  };

  return (
    <SimpleWishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </SimpleWishlistContext.Provider>
  );
};
