// frontend/src/pages/seller/Inventory.js
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { BASE_URL } from "../../services/api";

const Inventory = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/inventory`, { headers: authHeaders });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error("All fields are required");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/products`,
        {
          name: newProduct.name,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
          description: "",
        },
        { headers: authHeaders }
      );
      toast.success("Product added successfully");
      setNewProduct({ name: "", price: "", stock: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  const updateProduct = async (product) => {
    try {
      await axios.put(
        `${BASE_URL}/seller/inventory/${product.id}`,
        {
          price: Number(product.price),
          stock: Number(product.stock),
        },
        { headers: authHeaders }
      );
      toast.success("Product updated successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/products/${id}`, { headers: authHeaders });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  if (loading) return <div className="p-10 text-xl">Loading inventory...</div>;

  const filteredSortedProducts = products
    .filter((p) => (search ? p.name.toLowerCase().includes(search.toLowerCase()) : true))
    .sort((a, b) => {
      if (!sortField) return 0;
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === "price" || sortField === "stock") {
        valA = Number(valA);
        valB = Number(valB);
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredSortedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSortedProducts.length / productsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleChange = (id, field, value) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-2 md:space-y-0">
        <div>
          <label className="mr-2 font-semibold">Search:</label>
          <input
            type="text"
            placeholder="Search product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded p-1"
          />
        </div>
        <div>
          <label className="mr-2 font-semibold">Sort by:</label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="border rounded p-1">
            <option value="">None</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
          {sortField && (
            <button
              className="ml-2 px-2 py-1 bg-gray-200 rounded"
              onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            >
              {sortOrder === "asc" ? "?" : "?"}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Price ($)</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-green-50">
              <td className="py-2 px-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="border rounded p-1 w-40"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="border rounded p-1 w-20"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="border rounded p-1 w-24"
                />
              </td>
              <td className="py-2 px-4">
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={addProduct}>
                  Add
                </button>
              </td>
            </tr>

            {currentProducts.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    value={p.stock}
                    onChange={(e) => handleChange(p.id, "stock", Number(e.target.value))}
                    className="border rounded p-1 w-20"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => handleChange(p.id, "price", Number(e.target.value))}
                    className="border rounded p-1 w-24"
                  />
                </td>
                <td className="py-2 px-4 flex space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => updateProduct(p)}>
                    Update
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => deleteProduct(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`px-3 py-1 border rounded ${num === currentPage ? "bg-gray-300 font-bold" : ""}`}
              onClick={() => goToPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
