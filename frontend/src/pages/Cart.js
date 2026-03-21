import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } =
    useContext(CartContext);

  const handleRemove = (product) => {
    removeFromCart(product);
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6 min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
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
    <div className="p-6 min-h-screen max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="border rounded shadow p-4 relative bg-white"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="font-bold mt-2">{item.name}</h3>
            <p className="text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            <p className="font-semibold mt-1">${item.price}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() =>
                  updateQuantity(item.id, Math.max(0, (item.quantity || 1) - 1))
                }
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.quantity || 1}</span>
              <button
                onClick={() =>
                  updateQuantity(item.id, (item.quantity || 1) + 1)
                }
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleRemove(item)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-2"
            >
              <FaTrash /> Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold">
          Total: ${totalPrice.toFixed(2)}
        </h2>
        <Link
          to="/checkout"
          className="inline-block mt-3 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
