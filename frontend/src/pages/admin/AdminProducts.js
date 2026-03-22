import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://ecommerce-backend-ol0h.onrender.com/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const processedProducts = response.data.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        category: product.category || 'Uncategorized',
        seller: product.seller_name || 'Unknown Seller',
        sellerId: product.seller_id,
        stock: product.stock || 0,
        status: product.isNew ? 'new' : (product.isSale ? 'on sale' : 'normal'),
        featured: product.isNew ? 'featured' : 'normal',
        createdAt: new Date(product.created_at).toISOString().split('T')[0],
        description: product.description || 'No description available'
      }));
      setProducts(processedProducts);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeProduct = async (id) => {
    try {
      await axios.delete(`https://ecommerce-backend-ol0h.onrender.com/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch {
      toast.error("Failed to remove product");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category || "-"}</td>
                <td className="p-3">${Number(p.price || 0).toFixed(2)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => removeProduct(p.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
