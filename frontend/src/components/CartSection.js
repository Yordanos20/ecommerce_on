// src/components/CartSection.js
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

export default function CartSection() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <p className="text-gray-500">Your cart is empty. <Link to="/products" className="text-blue-600 hover:underline">Shop Products</Link></p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <div key={item.id} className="border rounded shadow p-4 relative bg-white">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded" />
            <h3 className="font-bold mt-2">{item.name}</h3>
            <p className="text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            <p className="font-semibold mt-1">ETB {Number((item.price || 0) * 55).toFixed(2)}</p>

            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => updateQuantity(item.id, Math.max(0, (item.quantity || 1) - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <span>{item.quantity || 1}</span>
              <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>

            <button onClick={() => removeFromCart(item)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-2">
              <FaTrash /> Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold">Total: ETB {Number((totalPrice || 0) * 55).toFixed(2)}</h2>
        <Link to="/checkout" className="inline-block mt-3 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}