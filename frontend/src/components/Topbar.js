import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBell, FaShoppingCart, FaUserCircle } from "react-icons/fa";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Search */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-80">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <button onClick={() => navigate("/cart")} className="relative text-gray-700 text-xl">
          <FaShoppingCart />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            3
          </span>
        </button>
        <button className="relative text-gray-700 text-xl">
          <FaBell />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 rounded-full">
            5
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="cursor-pointer flex items-center gap-2"
          >
            <FaUserCircle className="text-2xl text-gray-700" />
            <span className="hidden md:block font-medium">{user?.name}</span>
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2">
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/orders")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Orders
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}