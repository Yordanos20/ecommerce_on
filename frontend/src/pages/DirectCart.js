import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { localStorageHelper } from "../utils/localStorageHelper";

export default function DirectCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🛒 DirectCart: Component mounted');
    
    // Force refresh from localStorage every time using localStorageHelper
    const loadCart = () => {
      try {
        console.log('🛒 DirectCart: Loading cart with localStorageHelper...');
        const cartData = localStorageHelper.getItem('cart');
        console.log('🛒 DirectCart: Cart data from helper:', cartData);
        console.log('🛒 DirectCart: Cart length:', cartData.length);
        setCartItems(cartData);
      } catch (error) {
        console.error('🛒 DirectCart: Error loading cart data:', error);
        setCartItems([]);
      }
      setLoading(false);
    };

    loadCart();
    
    // Also set up an interval to keep checking
    const interval = setInterval(loadCart, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p>Loading cart...</p>
      </div>
    );
  }

  console.log('🛒 DirectCart: Rendering with items:', cartItems);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart (Direct)</h1>
      
      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <p>Cart Items Count: {cartItems.length}</p>
        <p>Raw localStorage: {localStorage.getItem('cart')}</p>
        <button 
          onClick={() => {
            console.log('🛒 DirectCart: Manual refresh clicked');
            const cartData = localStorageHelper.getItem('cart');
            console.log('🛒 DirectCart: Manual refresh data from helper:', cartData);
            setCartItems(cartData);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Manual Refresh
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart to see them here.</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Shop Products
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length}):</h2>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-bold">{item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity || 1}</p>
                <p>ID: {item.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
