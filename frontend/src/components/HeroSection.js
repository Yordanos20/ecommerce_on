// frontend/src/components/HeroSection.js
import { Link } from "react-router-dom";

export default function HeroSection() {

  // Smooth scroll to sections
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/6214480/pexels-photo-6214480.jpeg')",
      }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>

      {/* Content */}
      <div className="relative text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Shop Smart. <span className="text-blue-500">Live Better.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mt-6">
          Discover premium products with unbeatable prices and fast delivery.
        </p>

        {/* Quick Section Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => scrollToSection("new-arrivals")}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition shadow-md"
          >
            🆕 New Arrivals
          </button>
          <button
            onClick={() => scrollToSection("featured-collection")}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition shadow-md"
          >
            ⭐ Featured
          </button>
          <button
            onClick={() => scrollToSection("trending-products")}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition shadow-md"
          >
            🔥 Trending
          </button>
        </div>

        {/* Shop Now Button */}
        <Link
          to="/products"
          className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-xl"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}