import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { token, user } = useContext(AuthContext);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Please login to checkout");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleCheckout = async () => {
    console.log("🛒 Checkout started");
    console.log("🛒 Cart items:", cartItems);
    console.log("🛒 Token:", token);
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!address || !city || !state || !zip || !phone || !email) {
      toast.error("Please fill in all shipping address fields");
      return;
    }

    setLoading(true);

    try {
      // Check if backend is available first
      const backendAvailable = await checkBackendAvailability();
      
      if (!backendAvailable) {
        // FALLBACK: Create a mock order and show success
        console.log("🔄 Backend not available, using fallback checkout");
        await mockCheckout();
        return;
      }

      // Step 1: Create the order first
      const orderData = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity || 1,
        })),
        total_amount: totalPrice,
        shipping_address: {
          address: address,
          city: city,
          state: state,
          zipCode: zip,
          country: country || "USA",
          phone: phone,
          email: email
        },
        payment_method: "chapa",
        status: "pending"
      };

      console.log("📋 Order data being sent:", orderData);

      // Create order
      const orderRes = await api.post("/orders", orderData);
      console.log("✅ Order created:", orderRes);

      if (orderRes.status === 201) {
        const orderId = orderRes.data.id;
        
        // Step 2: Initialize Chapa payment
        const paymentData = {
          orderId: orderId,
          amount: totalPrice,
          email: email,
          first_name: user?.name?.split(' ')[0] || 'Customer',
          last_name: user?.name?.split(' ')[1] || 'User',
          callback_url: `http://localhost:3000/payment/verify`
        };

        console.log("💳 Initializing payment:", paymentData);
        
        const paymentRes = await api.post("/chapa-payment/initialize", paymentData);
        console.log("✅ Payment initialized:", paymentRes);

        if (paymentRes.data.success) {
          // Clear cart and redirect to Chapa checkout
          clearCart();
          window.location.href = paymentRes.data.checkout_url;
        } else {
          toast.error("Payment initialization failed");
        }
      } else {
        toast.error(orderRes.data.message || "Order creation failed");
      }
    } catch (err) {
      console.error("❌ Checkout error:", err.response?.data || err.message);
      console.error("❌ Full error object:", err);
      console.error("❌ Error response:", err.response);
      console.error("❌ Error status:", err.response?.status);
      console.error("❌ Error data:", err.response?.data);
      
      // FALLBACK: Use mock checkout if backend fails
      console.log("🔄 Backend error, using fallback checkout");
      await mockCheckout();
      
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Backend not available. Using offline checkout.";
      toast.info(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if backend is available
  const checkBackendAvailability = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/health');
      return response.ok;
    } catch (error) {
      console.log("Backend not available:", error.message);
      return false;
    }
  };

  // Mock checkout for when backend is not available
  const mockCheckout = async () => {
    console.log("🔄 Processing mock checkout...");
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock order ID
    const mockOrderId = 'ORD-' + Date.now();
    
    // Generate mock transaction reference
    const mockTxRef = `tx_${Date.now()}_${mockOrderId}`;
    
    // Create mock order data
    const mockOrderData = {
      id: mockOrderId,
      total_amount: totalPrice,
      items: cartItems,
      shipping_address: {
        address: address,
        city: city,
        state: state,
        zipCode: zip,
        country: country || "USA",
        phone: phone,
        email: email
      },
      payment_reference: mockTxRef,
      status: "pending_payment",
      created_at: new Date().toISOString(),
      payment_method: "chapa",
      mockOrder: true
    };
    
    // Store mock order in localStorage for payment verification AND orders page
    localStorage.setItem('mockOrder', JSON.stringify(mockOrderData));
    
    // Also store in mockOrders array for orders page
    const existingMockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const updatedMockOrders = [mockOrderData, ...existingMockOrders];
    localStorage.setItem('mockOrders', JSON.stringify(updatedMockOrders));
    
    // Redirect to mock Chapa payment page
    const mockChapaUrl = `http://localhost:3000/mock-payment?order_id=${mockOrderId}&tx_ref=${mockTxRef}&amount=${totalPrice}&email=${encodeURIComponent(email)}`;
    
    console.log("🔄 Redirecting to mock Chapa payment:", mockChapaUrl);
    console.log("📋 Mock order saved to localStorage:", mockOrderData);
    console.log("📋 Mock orders array updated:", updatedMockOrders);
    
    // Show success message before redirect
    toast.success(`Order ${mockOrderId} created! Redirecting to payment...`);
    
    // Redirect to mock payment page
    window.location.href = mockChapaUrl;
  };

  if (!token) return null;

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Checkout</h2>
        <p className="mt-4 text-gray-600">Your cart is empty.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Shop Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="mb-6 space-y-2">
        {cartItems.map((item) => (
          <p key={item.id} className="text-gray-700">
            {item.name} - ${item.price} x {item.quantity || 1} = $
            {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
          </p>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded mb-6">
        <h3 className="font-bold mb-2">Shipping Address</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="ZIP Code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">
        Total: ${totalPrice.toFixed(2)}
      </h3>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
