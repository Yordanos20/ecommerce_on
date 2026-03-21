// frontend/src/pages/seller/Revenue.js
import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FiDollarSign, FiTrendingUp, FiCalendar, FiBarChart2 } from "react-icons/fi";

const Revenue = () => {
  const { token } = useContext(AuthContext);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRevenue = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/seller/revenue");
      setRevenueData(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch revenue");
      setError("Failed to load revenue data");
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
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

  const totalRevenue = revenueData.reduce((sum, r) => sum + Number(r.revenue || 0), 0);
  const currentMonth = revenueData[revenueData.length - 1]?.revenue || 0;
  const previousMonth = revenueData[revenueData.length - 2]?.revenue || 0;
  const growth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1) : 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Revenue</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Track your earnings and revenue trends
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiDollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ${totalRevenue.toFixed(2)}
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
                <FiCalendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ${currentMonth.toFixed(2)}
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
                <FiTrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Growth
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {growth > 0 ? '+' : ''}{growth}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <FiBarChart2 className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Monthly Revenue
              </h3>
            </div>
            
            {revenueData.length === 0 ? (
              <div className="mt-4 text-center py-8">
                <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No revenue data</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start making sales to see your revenue data here.
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="space-y-3">
                  {revenueData.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {month.month}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          ${Number(month.revenue || 0).toFixed(2)}
                        </div>
                        <div className="ml-3 w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${totalRevenue > 0 ? (month.revenue / totalRevenue) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
