import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaShieldAlt, FaLock, FaUserShield, FaExclamationTriangle } from "react-icons/fa";

export default function AdminPortal() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter admin credentials ❌");
      return;
    }

    setLoading(true);

    try {
      // Add admin role to login request
      const result = await login(formData.email, formData.password, 'admin');
      
      if (result.success) {
        toast.success("Admin login successful! 🔐");
        navigate("/admin/dashboard");
      } else {
        toast.error(result.message || "Invalid admin credentials ❌");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Login failed. Please try again. ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Admin Portal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <FaShieldAlt className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400 text-sm">Secure access for system administrators</p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <FaExclamationTriangle className="text-yellow-500 text-sm" />
            <span className="text-yellow-500 text-xs">Authorized Personnel Only</span>
          </div>
        </div>

        {/* Admin Login Form */}
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaUserShield className="inline mr-2" />
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaLock className="inline mr-2" />
                Admin Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter secure password"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-t-white border-r-red-600 mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Access Admin Panel
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-yellow-400">Security Notice:</p>
                <p>This portal is restricted to authorized administrators only. All access attempts are logged and monitored.</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to Customer Login
            </Link>
            <div className="mt-4">
              <Link
                to="/forgot-password"
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Forgot Admin Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
