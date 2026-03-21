import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

export default function BulletproofCart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount_price || item.price || 0;
      return total + (price * (item.quantity || 1));
    }, 0).toFixed(2);
  };

  console.log('🛒 BulletproofCart render - items:', cartItems, 'length:', cartItems.length);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Your Cart ({cartItems.length} items)</h1>

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
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
                            onClick={() => removeFromCart(item)}
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
                    <span className="font-medium">ETB {Number(getTotalPrice() * 55).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">ETB 0.00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>ETB {Number(getTotalPrice() * 55).toFixed(2)}</span>
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
      )}
    </div>
  );
}
