// frontend/src/pages/Products.js
import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function Products({ darkMode }) {
  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  // Extract unique values for filters
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const ratings = [5, 4, 3, 2, 1];

  const toggleWishlist = (product) => {
    const exists = wishlist.some((w) => w.id === product.id);
    if (exists) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  useEffect(() => {
    console.log('🏠 Products page - fetching products');
    fetch("https://ecommerce-backend-ol0h.onrender.com/api/products")
      .then((res) => {
        console.log('🏠 Products API response status:', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('🏠 Products API data:', data);
        const allProducts = Array.isArray(data) ? data : (data.products || []);
        console.log('🏠 Products parsed:', allProducts.length);
        setProducts(allProducts);
        setLoading(false);

        // Set initial values from URL params
        const initialCategory = categoryParam || "";
        const initialSearch = searchParam || "";
        setSelectedCategory(initialCategory);
        setSearchQuery(initialSearch);

        // Apply initial filters
        applyFilters(allProducts, initialCategory, initialSearch);
      })
      .catch((error) => {
        console.error('🏠 Products fetch error:', error);
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
        toast.error('Failed to load products - please refresh');
      });
  }, []); // Remove dependencies to prevent re-fetch loops

  const applyFilters = (productsToFilter = products, category = selectedCategory, search = searchQuery) => {
    let filtered = [...productsToFilter];

    // Category filter
    if (category) {
      filtered = filtered.filter((p) => 
        p.category?.toLowerCase() === category.toLowerCase() || 
        p.category_id?.toString() === category
      );
    }

    // Search filter
    if (search) {
      filtered = filtered.filter((p) =>
        String(p.name || "").toLowerCase().includes(search.toLowerCase()) ||
        String(p.description || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    // Rating filter
    if (selectedRating) {
      filtered = filtered.filter((p) => Number(p.rating) >= Number(selectedRating));
    }

    // Price range filter
    filtered = filtered.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Sort
    if (sortOption) {
      switch (sortOption) {
        case "price-low-high":
          filtered.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "price-high-low":
          filtered.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case "new-arrivals":
          filtered = filtered.filter((p) => Number(p.isNew) === 1);
          break;
        case "most-popular":
          filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
          break;
        case "on-sale":
          filtered = filtered.filter((p) => Number(p.isSale) === 1);
          break;
        case "name-a-z":
          filtered.sort((a, b) => String(a.name).localeCompare(String(b.name)));
          break;
        case "name-z-a":
          filtered.sort((a, b) => String(b.name).localeCompare(String(a.name)));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, searchQuery, selectedBrand, selectedRating, priceRange, sortOption]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("");
    setSelectedRating("");
    setPriceRange({ min: 0, max: 1000 });
    setSortOption("");
    setSelectedCategory("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  if (loading) {
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
            <svg className="animate-spin w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen transition-colors duration-300`}
    >
      <div className="p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {searchParam
              ? `Search Results for "${searchParam}"`
              : selectedCategory
              ? `${selectedCategory} Products`
              : "All Products"}
          </h1>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"
                }`}
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg transition ${
                darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </form>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-8 p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block font-semibold mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition ${
                      darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block font-semibold mb-2">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition ${
                      darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block font-semibold mb-2">Minimum Rating</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition ${
                      darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  >
                    <option value="">All Ratings</option>
                    {ratings.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Stars & Up
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block font-semibold mb-2">Sort By</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition ${
                      darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  >
                    <option value="">Default</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-a-z">Name: A to Z</option>
                    <option value="name-z-a">Name: Z to A</option>
                    <option value="new-arrivals">New Arrivals</option>
                    <option value="most-popular">Most Popular</option>
                    <option value="on-sale">On Sale</option>
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div className="mt-6">
                <label className="block font-semibold mb-2">Price Range</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className={`w-24 px-3 py-2 rounded-lg border focus:outline-none transition ${
                      darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className={`w-24 px-3 py-2 rounded-lg border focus:outline-none transition ${
                      darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  />
                  <button
                    onClick={clearFilters}
                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {(selectedCategory || selectedBrand || selectedRating || searchQuery) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedBrand && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                Brand: {selectedBrand}
                <button
                  onClick={() => setSelectedBrand("")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedRating && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                Rating: {selectedRating}+ Stars
                <button
                  onClick={() => setSelectedRating("")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlist={wishlist.map((w) => w.id)}
                toggleWishlist={() => toggleWishlist(product)}
                addToCart={addToCart}
                setQuickView={setQuickView}
                darkMode={darkMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-lg text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={() => setQuickView(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} p-6 rounded-xl max-w-2xl w-full flex flex-col md:flex-row gap-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-1/2">
                <img src={quickView.image} alt={quickView.name} className="w-full h-64 object-cover rounded-lg" />
              </div>

              <div className="md:w-1/2 flex flex-col gap-4">
                <h3 className="text-2xl font-bold">{quickView.name}</h3>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">${quickView.price}</p>
                <p>{quickView.description}</p>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">({quickView.rating || 0})</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stock: {quickView.stock}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      addToCart({ ...quickView, quantity: 1 });
                      toast.success(`${quickView.name} added to cart!`);
                      setQuickView(null);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      const exists = wishlist.some((w) => w.id === quickView.id);
                      toggleWishlist(quickView);
                      toast.info(exists ? "Removed from wishlist" : "Added to wishlist");
                    }}
                    className={`flex-1 border py-2 rounded-lg ${
                      wishlist.some((w) => w.id === quickView.id) ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    {wishlist.some((w) => w.id === quickView.id) ? "❤️ Wishlist" : "🤍 Wishlist"}
                  </button>
                </div>

                <button
                  onClick={() => setQuickView(null)}
                  className="mt-4 bg-gray-200 dark:bg-gray-700 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
