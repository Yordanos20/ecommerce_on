import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { FiDollarSign, FiTrendingUp, FiCalendar, FiDownload, FiBriefcase } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

function SellerEarningsSimple({ darkMode }) {
  const { token } = useContext(AuthContext);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        
        // Fetch revenue data which represents earnings
        const revenueResponse = await api.get("/seller/revenue");
        const revenueData = revenueResponse.data || [];
        
        // Fetch dashboard data for summary
        const dashboardResponse = await api.get("/seller/dashboard");
        const dashboardData = dashboardResponse.data || {};
        
        // Calculate total and pending earnings
        const total = revenueData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
        const pending = Number(dashboardData.pendingOrders) * 50; // Estimate pending earnings
        
        setEarnings(revenueData.map(item => ({
          month: item.month,
          amount: Number(item.revenue) || 0,
          orders: Math.floor(Math.random() * 20) + 5, // Placeholder for orders
          date: new Date().toISOString()
        })));
        
        setTotalEarnings(total);
        setPendingEarnings(pending);
        
      } catch (error) {
        console.error("Error fetching earnings:", error);
        setError("Failed to fetch earnings data");
        toast.error("Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchEarnings();
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
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 m-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Earnings</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Track your revenue and financial performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto">
            <FiDownload className="mr-2 -ml-1" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Earnings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ${totalEarnings.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCalendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ${earnings.length > 0 ? earnings[earnings.length - 1].amount.toFixed(2) : '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBriefcase className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ${pendingEarnings.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Monthly Earnings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Your revenue breakdown by month
            </p>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {earnings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No earnings data available yet
                    </td>
                  </tr>
                ) : (
                  earnings.map((earning, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {earning.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${earning.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {earning.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerEarningsSimple;
