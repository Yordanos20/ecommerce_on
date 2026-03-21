import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Please login to checkout");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    // Prepare cart for backend
    const cart = cartItems.map((item) => ({
      product_id: item.id,
      seller_id: item.seller_id || null, // optional
      price: item.price,
      quantity: item.quantity || 1,
    }));

    try {
      const res = await api.post("/orders", {
        cart,
        total_price: totalPrice,
        city,
        state,
        zip,
      });

      if (res.status === 201) {
        clearCart();
        toast.success(`Order placed! Order ID: ${res.data.order_id}`);
        navigate("/customer");
      } else {
        toast.error(res.data.message || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
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
        <div className="grid grid-cols-3 gap-2">
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
          <input
            type="text"
            placeholder="Zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="border p-2 rounded"
          />
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