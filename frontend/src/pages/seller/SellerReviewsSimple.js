// frontend/src/pages/seller/SellerReviews.js
import { useState, useEffect, useContext } from "react";
import { FiStar, FiMessageSquare, FiFilter, FiSearch, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

function SellerReviews({ darkMode }) {
  const { token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    if (!token) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        console.log("Fetching seller reviews...");
        
        const response = await api.get("/reviews/seller/reviews");
        
        // Transform the data to match expected format
        const transformedReviews = response.data.reviews.map(review => ({
          id: review.id,
          customerName: review.user_name || 'Anonymous Customer',
          productName: review.product_name || 'Product',
          rating: review.rating || 5,
          comment: review.comment || 'No comment provided',
          date: new Date(review.created_at).toLocaleDateString(),
          helpful: 0,
          notHelpful: 0,
          status: "published",
          response: review.seller_response || null,
          responseDate: review.response_date || null,
          verified: true
        }));
        
        setReviews(transformedReviews);
        console.log("Reviews loaded:", transformedReviews.length);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reviews</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Customer feedback for your products
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiStar className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-8">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || filterRating !== "all" 
                ? "No reviews found matching your criteria." 
                : "No customer reviews yet. When customers review your products, they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          {review.date}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.customerName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {review.productName}
                        </p>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {review.comment}
                        </p>
                      </div>

                      {review.response && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Your Response:
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {review.response}
                          </p>
                          {review.responseDate && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {review.responseDate}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <button className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
                      <FiThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </button>
                    <button className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
                      <FiThumbsDown className="h-4 w-4 mr-1" />
                      Not Helpful ({review.notHelpful})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerReviews;
