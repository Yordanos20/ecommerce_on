// frontend/src/components/SellerLayout.js
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  FaBars, FaUserCircle, FaCog, FaEnvelope, FaLifeRing, FaCreditCard, 
  FaChartLine, FaBoxOpen, FaDollarSign, FaPlus, FaTags, FaWarehouse,
  FaBolt, FaStar, FaStore, FaBell, FaChartBar, FaShoppingCart, FaTimes
} from "react-icons/fa";

function SellerLayout({ darkMode, setDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/seller/dashboard", icon: <FaChartLine /> },
    { 
      name: "Products", 
      path: "/seller/products", 
      icon: <FaBoxOpen />,
      submenu: [
        { name: "All Products", path: "/seller/products" },
        { name: "Add Product", path: "/seller/products/add" },
        { name: "Categories", path: "/seller/products/categories" }
      ]
    },
    { name: "Orders", path: "/seller/orders", icon: <FaShoppingCart /> },
    { name: "Inventory", path: "/seller/inventory", icon: <FaWarehouse /> },
    { name: "Analytics", path: "/seller/analytics", icon: <FaChartBar /> },
    { name: "Promotions", path: "/seller/promotions", icon: <FaBolt /> },
    { name: "Reviews", path: "/seller/reviews", icon: <FaStar /> },
    { name: "Earnings", path: "/seller/earnings", icon: <FaDollarSign /> },
  ];

  const dropdownItems = [
    { name: "Store Profile", path: "/seller/profile", icon: <FaStore /> },
    { name: "Settings", path: "/seller/settings", icon: <FaCog /> },
    { name: "Notifications", path: "/seller/notifications", icon: <FaBell /> },
    { name: "Messages", path: "/seller/messages", icon: <FaEnvelope /> },
    { name: "Support", path: "/seller/support", icon: <FaLifeRing /> },
    { name: "Billing", path: "/seller/billing", icon: <FaCreditCard /> },
  ];

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) => {
    if (item.submenu) {
      return item.submenu.some(subItem => location.pathname === subItem.path);
    }
    return isActive(item.path);
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${darkMode ? 'bg-gray-800' : 'bg-white'} 
        ${darkMode ? 'text-white' : 'text-gray-900'}
        flex-shrink-0 transition-all duration-300 ease-in-out
        h-full shadow-lg
      `}>
        {/* Sidebar Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <FaStore className="text-blue-500" />
            <h1 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>
              Seller Panel
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <div key={item.name}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${isParentActive(item) 
                    ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600'
                    : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <span className="mr-3">{item.icon}</span>
                <span className={`flex-1 ${!sidebarOpen && 'hidden'}`}>{item.name}</span>
                {item.submenu && sidebarOpen && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>
              {/* Submenu */}
              {item.submenu && isParentActive(item) && sidebarOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={`
                        block px-4 py-2 text-sm rounded transition-colors
                        ${isActive(subItem.path)
                          ? darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                          : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default SellerLayout;