// frontend/src/pages/ProductDetail.js
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(res => {
        setProduct({
          ...res.data,
          selectedColor: res.data.colors?.[0] || null,
          selectedSize: res.data.sizes?.[0] || null,
        });
        setMainImage(res.data.image);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load product details");
        setLoading(false);
      });

    // Fetch reviews for this product
    const fetchReviews = async () => {
      try {
        const res = await api.get(`http://localhost:5000/api/reviews/product/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (product) {
      api.get(`/products`)
        .then((res) => {
          const filtered = res.data.filter(
            (p) => p.category === product.category && p.id !== product.id
          );
          setRelatedProducts(filtered.slice(0, 4));
        })
        .catch((err) => console.error(err));
    }
  }, [product]);

  if (loading) return <p className="p-6 text-center">Loading product...</p>;
  if (!product) return <p className="p-6 text-center">Product not found.</p>;

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
      await api.post(
        `http://localhost:5000/api/reviews`,
        {
          product_id: id,
          rating: reviewRating,
          comment: reviewComment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setReviews(prev => [...prev, { rating: reviewRating, comment: reviewComment, user_name: user.name }]);

      setReviewComment("");
      setReviewRating(5);
      toast.success("Review submitted!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await api.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success("Review deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      {/* Main product area */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Left - Images */}
        <div className="md:w-1/2 flex flex-col">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
            {[product.image, ...(product.additionalImages || [])].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name}-${idx}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 transition-transform duration-200 hover:scale-105 ${mainImage === img ? "border-blue-600" : "border-gray-300"}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-4">
            <p className="text-2xl font-semibold text-blue-600">${product.price}</p>
          </div>

          <p className="flex items-center text-yellow-500">
            {"⭐".repeat(Math.round(product.rating))}{" "}
            <span className="text-gray-600 ml-2">({product.rating} / 5)</span>
          </p>

          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">-</button>
            <span className="text-lg">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">+</button>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => { addToCart({ ...product, quantity }); toast.success(`${product.name} added to cart!`); }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => { addToCart({ ...product, quantity }); toast.success(`${product.name} added to cart!`); navigate("/checkout"); }}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Buy Now
            </button>
          </div>

          {/* Tabs, Description, Reviews remain untouched */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex border-b border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 py-2 font-semibold text-center ${activeTab === "description" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-2 font-semibold text-center ${activeTab === "reviews" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}
              >
                Reviews
              </button>
            </div>

            <div className="mt-4 text-gray-700 dark:text-gray-300">
              {activeTab === "description" && <p>{product.description}</p>}
              {activeTab === "reviews" && (
                <>
                  {reviews.length > 0 ? (
                    <ul>
                      {reviews.map((rev, idx) => (
                        <li key={idx} className="mb-2 border-b pb-2">
                          <p className="text-yellow-500">{"⭐".repeat(rev.rating)}</p>
                          <p>{rev.comment}</p>
                          <p className="text-gray-500 text-sm">- {rev.user_name}</p>
                          {user && rev.user_name === user.name && (
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="mt-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Delete Review
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Your product reviews will appear here.</p>
                  )}

                  {user ? (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Leave a Review</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <label>Rating:</label>
                        <select
                          value={reviewRating}
                          onChange={e => setReviewRating(Number(e.target.value))}
                          className="border p-1 rounded"
                        >
                          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ⭐</option>)}
                        </select>
                      </div>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full border p-2 rounded mb-2"
                      />
                      <button
                        onClick={handleSubmitReview}
                        disabled={submittingReview}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-600">
                      Please <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/login")}>log in</span> to leave a review.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products remain untouched */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="flex overflow-x-auto gap-4 pb-2">
            {relatedProducts.map(prod => (
              <div key={prod.id} className="flex-shrink-0 w-64">
                <ProductCard product={prod} wishlist={wishlist} toggleWishlist={() => {}} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}