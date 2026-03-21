// frontend/src/pages/Reviews.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Reviews() {
  const { token } = useContext(AuthContext); // JWT token
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch reviews by logged-in user
  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reviews/user", {
        headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent
      });
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReviews();
    else setLoading(false); // No user logged in
  }, [token]);

  // Delete review
  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Fix: send token in headers
      });
      setReviews(reviews.filter((rev) => rev.id !== id));
      toast.success("Review deleted!");
    } catch (err) {
      console.error(err.response || err);
      toast.error("Failed to delete review.");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading your reviews...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      {reviews.length === 0 ? (
        <p>Your product reviews will appear here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="border rounded-lg p-4 shadow-sm flex flex-col">
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={rev.product_image}
                  alt={rev.product_name}
                  className="w-16 h-16 object-cover rounded"
                />
                <h2
                  className="font-semibold cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/products/${rev.product_id}`)}
                >
                  {rev.product_name}
                </h2>
              </div>
              <p className="text-yellow-500 mb-1">{"⭐".repeat(rev.rating)}</p>
              <p className="mb-2">{rev.comment}</p>
              <button
                onClick={() => deleteReview(rev.id)}
                className="self-start px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}