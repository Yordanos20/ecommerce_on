import { useState } from "react";
import { FiTag, FiPlus, FiCalendar, FiPercent, FiGift, FiAlertCircle } from "react-icons/fi";

function SellerPromotionsSimple({ darkMode }) {
  const [promotions] = useState([]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Promotions</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your promotional campaigns and discounts
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto">
            <FiPlus className="mr-2 -ml-1" />
            Create Promotion
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <FiTag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Promotions Module</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Advanced promotions management is coming soon. This feature will include:
              </p>
              <div className="mt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center space-x-3">
                    <FiPercent className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Percentage Discounts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiGift className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Buy One Get One</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="h-5 w-5 text-purple-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Seasonal Sales</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <FiAlertCircle className="mr-2" />
                  Request Early Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerPromotionsSimple;
