// frontend/src/pages/seller/SellerAnalytics.js
import { useEffect, useState, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FiTrendingUp, FiShoppingCart, FiPackage, FiDollarSign, FiUsers, FiBarChart2 } from "react-icons/fi";

function SellerAnalytics({ darkMode }) {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({
    dashboard: {},
    revenue: [],
    topProducts: [],
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [dashboardRes, revenueRes, topProductsRes, ordersRes] = await Promise.all([
          api.get("/seller/dashboard"),
          api.get("/seller/revenue"),
          api.get("/seller/top-products?limit=5"),
          api.get("/seller/orders?limit=10")
        ]);
        
        setData({
          dashboard: dashboardRes.data,
          revenue: revenueRes.data,
          topProducts: topProductsRes.data,
          orders: ordersRes.data
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError("Failed to load analytics data");
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token]);

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
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  const { dashboard, revenue, topProducts, orders } = data;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Business insights and performance metrics
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiPackage className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Products
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {dashboard.totalProducts || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Orders
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {dashboard.totalOrders || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiDollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Revenue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ${Number(dashboard.totalRevenue || 0).toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {dashboard.pendingOrders || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <FiBarChart2 className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Monthly Revenue
              </h3>
            </div>
            <div className="mt-4">
              {revenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8">
                  <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No revenue data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <FiPackage className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Top Products
              </h3>
            </div>
            <div className="mt-4">
              {topProducts.length > 0 ? (
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white mr-3">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {product.totalSold || 0} sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${Number(product.totalRevenue || 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${Number(product.price || 0).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No product sales data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <FiShoppingCart className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Recent Orders
              </h3>
            </div>
            <div className="mt-4">
              {orders.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${Number(order.total || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {order.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No order data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerAnalytics;
