// frontend/src/pages/seller/SellerDashboard.js
import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { 
  FiPackage, FiShoppingCart, FiDollarSign, FiAlertTriangle, FiTrendingUp,
  FiStar, FiCalendar, FiClock, FiCheckCircle, FiTruck, FiActivity, FiRefreshCw
} from "react-icons/fi";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

function SellerDashboard({ darkMode }) {
  const { token, user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    thisMonthRevenue: 0,
    thisWeekOrders: 0,
    averageRating: 0,
    lowStockCount: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [controller, setController] = useState(null);
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);

  const fetchDashboardData = async (retryCount = 0) => {
    // Prevent multiple simultaneous calls
    if (!isMountedRef.current || isLoadingRef.current) return;
    
    // Set loading flag
    isLoadingRef.current = true;
    
    // Cancel any previous request
    if (controller) {
      controller.abort();
    }
    
    const newController = new AbortController();
    setController(newController);
    
    try {
      if (!isMountedRef.current) return;
      if (refreshing) setRefreshing(true);
      else setLoading(true);
      setError("");

      console.log("Fetching seller dashboard data...");

      // Helper function to fetch with timeout and error handling
      const fetchWithFallback = async (url, fallbackData = []) => {
        try {
          const response = await api.get(url);
          return response.data;
        } catch (error) {
          console.warn(`Failed to fetch ${url}, using fallback data:`, error.message);
          return fallbackData;
        }
      };

      // Fetch all data with fallbacks
      const [statsData, ordersData, revenueData, topProductsData, lowStockData, reviewsResponse] = await Promise.allSettled([
        fetchWithFallback("/seller/dashboard", {
          totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0
        }),
        fetchWithFallback("/seller/orders?limit=10", []),
        fetchWithFallback("/seller/revenue", []),
        fetchWithFallback("/seller/top-products?limit=5", []),
        fetchWithFallback("/seller/low-stock?threshold=10", []),
        fetchWithFallback("/reviews/seller/reviews?limit=5", { reviews: [] })
      ]);

      // Extract data from Promise.allSettled results
      const stats = statsData.status === 'fulfilled' ? statsData.value : {
        totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0
      };
      const orders = ordersData.status === 'fulfilled' ? ordersData.value : [];
      const revenue = revenueData.status === 'fulfilled' ? revenueData.value : [];
      const topProducts = topProductsData.status === 'fulfilled' ? topProductsData.value : [];
      const lowStock = lowStockData.status === 'fulfilled' ? lowStockData.value : [];
      const reviews = reviewsData.status === 'fulfilled' ? reviewsData.value : { reviews: [] };

      // Calculate additional stats
      const thisMonthRevenue = revenue?.[revenue.length - 1]?.revenue || 0;
      const thisWeekOrders = orders?.filter(order => {
        const orderDate = new Date(order.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
      }).length || 0;

      const averageRating = reviews?.reviews?.length > 0 
        ? reviews.reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.reviews.length 
        : 0;

      // Set stats
      setStats({
        totalProducts: stats.totalProducts || 0,
        totalOrders: stats.totalOrders || 0,
        totalRevenue: Number(stats.totalRevenue) || 0,
        pendingOrders: stats.pendingOrders || 0,
        thisMonthRevenue: Number(thisMonthRevenue) || 0,
        thisWeekOrders: thisWeekOrders,
        averageRating: Number(averageRating.toFixed(1)) || 0,
        lowStockCount: lowStock?.length || 0
      });

      // Set orders
      setLatestOrders(orders?.slice(0, 5).map(order => ({
        id: order.orderId,
        customer: order.customerName,
        total: Number(order.total) || 0,
        status: order.status || 'pending',
        date: new Date(order.date).toLocaleDateString(),
      })) || []);

      // Set revenue data
      setRevenueData(revenue || []);

      // Set top products
      setTopProducts(topProducts?.map(product => ({
        id: product.id,
        name: product.name,
        sales: Number(product.totalSold) || 0,
        revenue: Number(product.totalRevenue) || 0,
        price: Number(product.price) || 0,
      })) || []);

      // Set low stock alerts
      setLowStockAlerts(lowStock?.map(product => ({
        id: product.id,
        name: product.name,
        currentStock: Number(product.stock) || 0,
        threshold: 10,
      })).slice(0, 3) || []);

      // Set reviews
      if (isMountedRef.current) {
        setRecentReviews(reviews?.reviews?.map(review => ({
          id: review.id,
          product: review.product_name,
          rating: review.rating,
          comment: review.comment,
          customer: review.user_name,
          date: new Date(review.created_at).toLocaleDateString(),
        })).slice(0, 3) || []);
      }

    } catch (error) {
      if (!isMountedRef.current) return;
      console.error("Error fetching dashboard data:", error.response?.data?.message || error.message);
      
      // Set fallback data on error
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        thisMonthRevenue: 0,
        thisWeekOrders: 0,
        averageRating: 0,
        lowStockCount: 0
      });
      setLatestOrders([]);
      setRevenueData([]);
      setTopProducts([]);
      setLowStockAlerts([]);
      setRecentReviews([]);
      
      setError("Unable to connect to server. Showing demo data.");
      toast.warning("Using demo data - server connection failed");
      
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
      // Reset loading flag
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Please login to access dashboard");
      setLoading(false);
      return;
    }

    fetchDashboardData();
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (controller) {
        controller.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FiClock className="h-4 w-4" />;
      case 'processing': return <FiActivity className="h-4 w-4" />;
      case 'shipped': return <FiTruck className="h-4 w-4" />;
      case 'delivered': return <FiCheckCircle className="h-4 w-4" />;
      case 'cancelled': return <FiAlertTriangle className="h-4 w-4" />;
      default: return <FiClock className="h-4 w-4" />;
    }
  };

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center">
            <FiAlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Unable to load dashboard</h3>
              <p className="mt-1 text-red-600 dark:text-red-300">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name || 'Seller'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Here's what's happening with your store today
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <FiPackage className="text-blue-600 dark:text-blue-400 text-lg sm:text-xl" />
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Products</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <FiShoppingCart className="text-green-600 dark:text-green-400 text-lg sm:text-xl" />
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Orders</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="text-purple-600 dark:text-purple-400 text-lg sm:text-xl" />
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toFixed(2)}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Revenue</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <FiStar className="text-yellow-600 dark:text-yellow-400 text-lg sm:text-xl" />
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Average</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Rating</p>
            </div>
          </div>
        </div>

      {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FiCalendar className="mr-2 flex-shrink-0" />
                <span className="truncate">Last 12 months</span>
              </div>
            </div>
            {revenueData.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'rgb(255 255 255)',
                        border: '1px solid rgb(229 231 235)',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <FiTrendingUp className="h-12 w-12 mb-3 opacity-50" />
                <p>No revenue data available</p>
                <p className="text-sm mt-1">Start making sales to see your revenue chart</p>
              </div>
            )}
          </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiTrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">This Month</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ${stats.thisMonthRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiShoppingCart className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">This Week</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.thisWeekOrders} orders
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiClock className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Pending</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.pendingOrders} orders
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiAlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Low Stock</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.lowStockCount} items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-8">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
              <Link 
                to="/seller/orders" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                View all
              </Link>
            </div>
            {latestOrders.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {latestOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.customer} • {order.date}
                      </p>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mr-3">
                        ${order.total.toFixed(2)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent orders</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Orders will appear here once customers start buying</p>
              </div>
            )}
          </div>

        {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Products</h2>
              <Link 
                to="/seller/products" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                View all
              </Link>
            </div>
            {topProducts.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.sales} sold • ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${product.revenue.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No product sales data</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your best-selling products will appear here</p>
              </div>
            )}
          </div>
        </div>

      {/* Low Stock Alerts and Recent Reviews */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Low Stock Alerts */}
          {lowStockAlerts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h2>
                <Link 
                  to="/seller/inventory" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Manage inventory
                </Link>
              </div>
              <div className="space-y-3">
                {lowStockAlerts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Only {product.currentStock} left in stock
                      </p>
                    </div>
                    <Link
                      to={`/seller/products/edit/${product.id}`}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Reviews */}
          {recentReviews.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Reviews</h2>
                <Link 
                  to="/seller/reviews" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {review.customer}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {review.product}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 overflow-hidden">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
