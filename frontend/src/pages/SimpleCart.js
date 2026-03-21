import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { localStorageHelper } from "../utils/localStorageHelper";

export default function SimpleCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load cart from localStorage on mount using localStorageHelper
  useEffect(() => {
    console.log('🛒 SimpleCart component mounted!');
    try {
      console.log('🛒 Loading cart from localStorageHelper...');
      const savedCart = localStorageHelper.getItem('cart');
      console.log('🛒 Loaded cart from helper:', savedCart);
      console.log('🛒 Cart length:', savedCart.length);
      setCart(savedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes using localStorageHelper
  useEffect(() => {
    localStorageHelper.setItem('cart', cart);
    console.log('🛒 Saved cart to localStorageHelper:', cart);
  }, [cart]);

  const removeFromCart = (productId) => {
    console.log('🗑️ Removing from cart:', productId);
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    console.log('🗑️ Removed and updated cart:', updatedCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    console.log('🔄 Updating quantity:', productId, 'to:', newQuantity);
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    console.log('🔄 Updated cart:', updatedCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.discount_price || item.price || 0;
      return total + (price * (item.quantity || 1));
    }, 0).toFixed(2);
  };

  if (loading) return <p className="p-6">Loading cart...</p>;

  console.log('🛒 SimpleCart render - cart state:', cart);
  console.log('🛒 SimpleCart render - cart length:', cart.length);

  if (cart.length === 0) {
    return (
      <div className="p-6 min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <FiHeart size={40} className="text-gray-400" />
        </div>
        <p className="text-gray-600 mb-6">Your cart is empty.</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Your Cart ({cart.length} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div 
              key={item.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0">
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {item.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="mb-3">
                    {item.discount_price ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary-600">
                          ${item.discount_price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${item.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${item.price}
                      </span>
                    )}
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${item.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${getTotalPrice()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block w-full text-center py-3 text-primary-600 hover:text-primary-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
