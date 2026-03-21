// frontend/src/pages/OrderConfirmation.js
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function OrderConfirmation() {
  const { id } = useParams();
  const { clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Check if this is a mock order from state
        if (location.state?.mockOrder) {
          console.log("🔄 Loading mock order from state");
          const mockOrderData = {
            id: location.state.orderId,
            total_amount: location.state.totalAmount,
            items: location.state.items,
            shipping_address: location.state.shippingAddress,
            status: "completed",
            created_at: new Date().toISOString(),
            payment_method: "offline",
            mockOrder: true
          };
          setOrder(mockOrderData);
          setLoading(false);
          return;
        }

        // Try to fetch real order from backend
        const token = localStorage.getItem("token");
        const response = await fetch(`https://ecommerce-backend-ol0h.onrender.com/api/orders/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
          // Clear cart only if order is successfully fetched
          clearCart();
        } else {
          throw new Error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        
        // Check if this looks like a mock order ID
        if (id && id.startsWith('ORD-')) {
          console.log("🔄 Creating fallback mock order");
          const fallbackOrder = {
            id: id,
            total_amount: 0,
            items: [],
            shipping_address: {
              address: "Mock Address",
              city: "Mock City",
              state: "Mock State",
              zipCode: "12345",
              country: "USA"
            },
            status: "completed",
            created_at: new Date().toISOString(),
            payment_method: "offline",
            mockOrder: true,
            note: "This is a mock order created because the backend is not available."
          };
          setOrder(fallbackOrder);
        } else {
          // Show error for real orders that can't be found
          setOrder(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, location.state, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order not found</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          {order.mockOrder && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-800 text-sm">
                  <strong>Mock Order:</strong> This order was created offline because the backend server is not available. 
                  This is for demonstration purposes only.
                </p>
              </div>
            </div>
          )}
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Thank you for your order. We'll send you an email with the order details.
            </p>
          </div>

          {/* Order Details */}
          <div className="border-t border-b py-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Number</p>
                <p className="font-semibold text-lg">#{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                <p className="font-medium">
                  {estimatedDelivery.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Status</p>
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {order.status || "Processing"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={item.image || "https://images.pexels.com/photos/90946/pexels-photo.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Shipping Address</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="font-medium">{order.shipping_address?.fullName}</p>
              <p className="text-gray-600 dark:text-gray-300">
                {order.shipping_address?.address}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {order.shipping_address?.phone}
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <h3 className="font-semibold mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                <span>${order.total_amount ? (order.total_amount * 0.9).toFixed(2) : "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Tax</span>
                <span>${order.total_amount ? (order.total_amount * 0.1).toFixed(2) : "0.00"}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.total_amount || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to={`/customer/orders/${id}/track`}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition text-center font-semibold"
          >
            Track Order
          </Link>
          <Link
            to="/products"
            className="flex-1 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition text-center font-medium"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• You'll receive an email confirmation shortly</li>
            <li>• We'll process your order within 1-2 business days</li>
            <li>• You'll get tracking information once your order ships</li>
            <li>• Estimated delivery: {estimatedDelivery.toLocaleDateString()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
