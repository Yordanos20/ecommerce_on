import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiDollarSign, FiAlertTriangle } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

function SellerProducts({ darkMode }) {
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/seller/inventory");
        
        // Transform the data to match expected format
        const transformedProducts = response.data.map(product => ({
          id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          stock: Number(product.stock) || 0,
          status: product.stock > 0 ? "active" : "out_of_stock",
          image: product.image || "https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=Product"
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProducts();
  }, [user]);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/seller/products/${productId}`);
        setProducts(products.filter(p => p.id !== productId));
        toast.success("Product deleted successfully");
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error("Failed to delete product");
      }
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: "text-red-600", bg: "bg-red-100", text: "Out of Stock" };
    if (stock < 5) return { color: "text-yellow-600", bg: "bg-yellow-100", text: "Low Stock" };
    return { color: "text-green-600", bg: "bg-green-100", text: "In Stock" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Products</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your product inventory
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/seller/add-product"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
          >
            <FiPlus className="mr-2 -ml-1" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="mt-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? "No products found matching your search." : "Get started by adding a new product."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div key={product.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <FiDollarSign className="h-4 w-4 text-gray-400" />
                          <span className="ml-1 text-sm text-gray-900 dark:text-white">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FiPackage className="h-4 w-4 text-gray-400" />
                        <span className="ml-1 text-sm text-gray-900 dark:text-white">
                          {product.stock} in stock
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      <Link
                        to={`/seller/edit-product/${product.id}`}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <FiEdit2 className="mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:border-red-600 dark:text-red-400"
                      >
                        <FiTrash2 className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProducts;
