import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products/trending/list")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-10">
        🔥 Trending Now
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />

            <h3 className="mt-4 font-semibold">{product.name}</h3>
            <p className="text-yellow-500">⭐ {product.rating}</p>
            <p className="text-blue-600 font-bold">${product.price}</p>

            <Link
              to={`/products/${product.id}`}
              className="mt-3 inline-block text-sm text-blue-600 hover:underline"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}