// frontend/src/pages/ProductDetailNew.js
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { SimpleWishlistContext } from "../context/SimpleWishlistContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import WorkingWishlistButton from "../components/WorkingWishlistButton";
import { localStorageHelper } from "../utils/localStorageHelper";

export default function ProductDetailNew() {
  const { id } = useParams();
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(SimpleWishlistContext);
  const { addToCart, cart } = useContext(CartContext); // Use CartContext instead of custom function
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Global product image overrides - same as landing page
  const productImageOverrides = {
    // Trending Products
    1: 'https://images.pexels.com/photos/3394662/pexels-photo-3394662.jpeg',  // Programming Book
    2: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',  // Shirt
    3: 'https://images.pexels.com/photos/3571094/pexels-photo-3571094.jpeg',  // Smartphones
    4: 'https://images.pexels.com/photos/823841/pexels-photo-823841.jpeg',    // Lamps
    
    // New Arrivals
    5: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg',  // Literature Book
    6: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',            // Laptops
    7: 'https://images.pexels.com/photos/10349969/pexels-photo-10349969.jpeg', // Sportswear
    8: 'https://images.pexels.com/photos/14642652/pexels-photo-14642652.jpeg', // Blankets
    
    // Featured Products
    9: 'https://images.pexels.com/photos/2258083/pexels-photo-2258083.jpeg',   // Finance Books
    10: 'https://images.pexels.com/photos/354939/pexels-photo-354939.jpeg',  // Jeans
    11: 'https://images.pexels.com/photos/2849599/pexels-photo-2849599.jpeg',  // Headphones
    12: 'https://images.pexels.com/photos/6045223/pexels-photo-6045223.jpeg',  // Spiritual Books
    13: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg',  // Vases
    14: 'https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg',  // Desktops
    15: 'https://images.pexels.com/photos/159472/headphones-instagram-video-games-razer-159472.jpeg', // Chair
    16: 'https://images.pexels.com/photos/372326/pexels-photo-372326.jpeg',     // Wall Art
    
    // Recommended Products
    17: 'https://images.pexels.com/photos/4887203/pexels-photo-4887203.jpeg', // Children Books
    18: 'https://images.pexels.com/photos/6769357/pexels-photo-6769357.jpeg', // Jackets
    19: 'https://images.pexels.com/photos/3945659/pexels-photo-3945659.jpeg', // Gaming Consoles
    20: 'https://images.pexels.com/photos/5698918/pexels-photo-5698918.jpeg', // Hats
  };

  // Get the overridden image for the main product
  const getProductImage = (product) => {
    return productImageOverrides[product.id] || product.image;
  };

  // Get overridden images for related products
  const getRelatedProductsWithImages = (relatedProducts) => {
    return relatedProducts.map(product => ({
      ...product,
      image: productImageOverrides[product.id] || product.image
    }));
  };

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    
    const fetchProduct = async () => {
      try {
        console.log(`🔍 Fetching product with ID: ${id}`);
        
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Product data received:', data);
        
        setProduct(data);
        const overriddenImage = getProductImage(data);
        setMainImage(overriddenImage || "https://images.pexels.com/photos/90946/pexels-photo.jpg");
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Product fetch error:', error);
        
        // FALLBACK TO MOCK DATA IF BACKEND IS DOWN
        console.log('🔄 Using mock data fallback...');
        const mockProduct = {
          id: parseInt(id) || 1,
          name: `Product ${id}`,
          description: "This is a sample product description. The backend server is currently not available, so we're showing mock data.",
          price: 29.99,
          stock: 50,
          rating: 4.5,
          category: "Sample Category",
          image: productImageOverrides[parseInt(id) || 1] || "https://images.pexels.com/photos/90946/pexels-photo.jpg",
          specifications: {
            "Material": "High Quality",
            "Color": "Various",
            "Size": "Standard"
          },
          colors: ["Red", "Blue", "Green"],
          sizes: ["S", "M", "L", "XL"]
        };
        
        setProduct(mockProduct);
        setMainImage(mockProduct.image);
        setError(null); // Clear the error since we have fallback data
        setLoading(false);
        toast.info("Backend server not available. Showing sample data.");
      }
    };

    fetchProduct();

    // Fetch reviews for this product
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/product/${id}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (product) {
      fetch("http://localhost:5000/api/products")
        .then(res => res.json())
        .then(data => {
          const productsData = Array.isArray(data) ? data : (data.products || []);
          const filtered = productsData.filter(
            (p) => p.category === product.category && p.id !== product.id
          );
          setRelatedProducts(filtered.slice(0, 4));
        })
        .catch((err) => console.error(err));
    }
  }, [product]);

  if (loading) return <p className="p-6 text-center">Loading product...</p>;
  if (!product) return <p className="p-6 text-center">Product not found.</p>;

  const isInWishlist = wishlist.some(item => item.id === product.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  // Submit a new review
  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("You must log in to submit a review!");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please enter your review comment.");
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: id,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (response.ok) {
        setReviews(prev => [...prev, { 
          rating: reviewRating, 
          comment: reviewComment, 
          user_name: user.name,
          created_at: new Date().toISOString()
        }]);
        setReviewComment("");
        setReviewRating(5);
        toast.success("Review submitted!");
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main product area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {[product.image, ...(product.additionalImages || [])].map((img, idx) => (
                  <img
                    key={idx}
                    src={img || "https://images.pexels.com/photos/90946/pexels-photo.jpg"}
                    alt={`${product.name}-${idx}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 transition-all ${
                      mainImage === img ? "border-blue-600 scale-105" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(img || "https://images.pexels.com/photos/90946/pexels-photo.jpg")}
                  />
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-bold text-blue-600">${product.price}</p>
                  <div className="flex items-center text-yellow-500">
                    {"⭐".repeat(Math.round(product.rating || 0))}
                    <span className="text-gray-600 ml-2">({product.rating || 0} / 5)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-semibold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => { 
                      addToCart(product, quantity); 
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => { 
                      addToCart(product, quantity); 
                      navigate("/checkout"); 
                    }}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Buy Now
                  </button>
                  <WorkingWishlistButton product={product} />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Product Details</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Category: {product.category}</li>
                  <li>• Stock: {product.stock} units available</li>
                  <li>• Seller: {product.seller_name || "Official Store"}</li>
                  <li>• Free shipping on orders over $50</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-t">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-3 font-medium border-b-2 transition ${
                  activeTab === "description"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-3 font-medium border-b-2 transition ${
                  activeTab === "reviews"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            <div className="py-6">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Review Form */}
                  {user && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold mb-4">Write a Review</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => setReviewRating(star)}
                                className={`text-2xl ${star <= reviewRating ? "text-yellow-500" : "text-gray-300"}`}
                              >
                                ⭐
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Your Review</label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="w-full p-3 border rounded-lg resize-none"
                            rows="3"
                            placeholder="Share your experience with this product..."
                          />
                        </div>
                        <button
                          onClick={handleSubmitReview}
                          disabled={submittingReview}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((rev, idx) => (
                        <div key={idx} className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              {rev.user_name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{rev.user_name}</p>
                              <div className="flex items-center gap-2">
                                <div className="text-yellow-500 text-sm">
                                  {"⭐".repeat(rev.rating)}
                                </div>
                                <span className="text-gray-500 text-xs">
                                  {new Date(rev.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  addToCart={(product) => addToCart(product, 1)}
                  toggleWishlist={() => isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                  wishlist={wishlist}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
