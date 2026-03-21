// frontend/src/pages/ShoppingCart.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function ShoppingCart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed to checkout");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  const updateItemQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart({ id });
    } else {
      updateQuantity(id, quantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "https://images.pexels.com/photos/90946/pexels-photo.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
                          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
                          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">ETB {Number((item.price || 0) * 55).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          ETB {Number((Number(item.price || 0) * (item.quantity || 1)) * 55).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="font-medium">ETB {Number((totalPrice || 0) * 55).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                  <span className="font-medium">ETB {Number(0 * 55).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="font-medium">ETB {Number((Number(totalPrice || 0) * 0.1) * 55).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>ETB {Number(((Number(totalPrice || 0) + Number(totalPrice || 0) * 0.1) * 55)).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => navigate("/products")}
                  className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-red-600 hover:text-red-700 transition text-sm"
                >
                  Clear Cart
                </button>
              </div>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
