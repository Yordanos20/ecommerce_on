// frontend/src/components/ProductCategories.js
import { useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
      </svg>
    ),
    color: "bg-blue-500",
    description: "Smartphones, laptops, and more",
    productCount: 245
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
      </svg>
    ),
    color: "bg-pink-500",
    description: "Clothing, shoes, and accessories",
    productCount: 189
  },
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
    ),
    color: "bg-green-500",
    description: "Furniture, decor, and appliances",
    productCount: 156
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
    ),
    color: "bg-orange-500",
    description: "Fitness gear and outdoor equipment",
    productCount: 98
  },
  {
    id: "books",
    name: "Books & Media",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
    ),
    color: "bg-purple-500",
    description: "Books, movies, and music",
    productCount: 267
  },
  {
    id: "toys",
    name: "Toys & Games",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    color: "bg-red-500",
    description: "Toys, games, and hobbies",
    productCount: 134
  }
];

export default function ProductCategories({ darkMode }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}>
            Shop by Category
          </h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-lg`}>
            Find exactly what you're looking for in our wide range of categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className={`relative overflow-hidden rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
                {/* Background Pattern */}
                <div className={`absolute inset-0 ${category.color} opacity-10`}></div>
                
                {/* Content */}
                <div className="relative p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${category.color} p-3 rounded-lg text-white`}>
                      {category.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {category.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {category.productCount} products
                      </p>
                    </div>
                  </div>
                  
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${category.color.replace('bg-', 'text-')} group-hover:underline`}>
                      Shop Now
                    </span>
                    <svg 
                      className={`w-5 h-5 ${category.color.replace('bg-', 'text-')} transform transition-transform duration-300 group-hover:translate-x-1`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                {hoveredCategory === category.id && (
                  <div className={`absolute inset-0 ${category.color} opacity-5 transition-opacity duration-300`}></div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${darkMode ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-gray-800"} transition-colors duration-200`}
          >
            View All Products
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
