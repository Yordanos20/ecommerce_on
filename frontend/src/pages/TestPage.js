// frontend/src/pages/TestPage.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function TestPage() {
  const [products, setProducts] = useState([]);
  const [apiStatus, setApiStatus] = useState("Checking...");

  useEffect(() => {
    // Test API connection
    fetch("http://localhost:5000/api/products")
      .then(res => {
        setApiStatus(`API Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const productsData = Array.isArray(data) ? data : (data.products || []);
        setProducts(productsData);
      })
      .catch(err => {
        setApiStatus(`API Error: ${err.message}`);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">System Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
          <p className="mb-2">{apiStatus}</p>
          <p className="text-sm text-gray-600">
            Found {products.length} products in database
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Products Sample</h2>
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.slice(0, 3).map(product => (
                <div key={product.id} className="border p-4 rounded">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-green-600 font-bold">${product.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600">No products found</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
          <div className="space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">Landing Page</Link>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            <Link to="/products" className="text-blue-600 hover:underline">Products</Link>
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Customer:</strong> customer@test.com / 123456</p>
            <p><strong>Seller:</strong> seller@test.com / 123456</p>
            <p><strong>Admin:</strong> madmin@gmail.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
