// frontend/src/pages/AdminLogin.js
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaShieldAlt, FaLock, FaUserShield, FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        {/* Admin Login Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
            <FaShieldAlt className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 text-sm">Secure administrative portal</p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <FaExclamationTriangle className="text-yellow-500 text-sm" />
            <span className="text-yellow-500 text-xs font-semibold">AUTHORIZED PERSONNEL ONLY</span>
          </div>
        </div>

        {/* Admin Login Form */}
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaUserShield className="inline mr-2" />
                Administrator Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@company.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaLock className="inline mr-2" />
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                  placeholder="Enter secure admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
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
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Access Admin Dashboard
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
                <p>This administrative portal is restricted to authorized system administrators only. All access attempts are logged and monitored for security purposes.</p>
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

    setLoading(true);

    try {
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
        {/* Admin Login Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
            <FaShieldAlt className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 text-sm">Secure administrative portal</p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <FaExclamationTriangle className="text-yellow-500 text-sm" />
            <span className="text-yellow-500 text-xs font-semibold">AUTHORIZED PERSONNEL ONLY</span>
          </div>
        </div>

        {/* Admin Login Form */}
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaUserShield className="inline mr-2" />
                Administrator Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@company.com"
                required
              />
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter secure password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Additional Security Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded bg-white/10"
                />
                <span className="text-purple-200 text-sm">Trust this device</span>
              </label>
              <span
                onClick={() => toast.info("Contact system administrator for password reset")}
                className="text-purple-300 cursor-pointer hover:text-purple-200 text-sm"
              >
                Reset Password?
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* System Information */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-purple-800/30 p-3 rounded-lg border border-purple-600/30">
              <p className="text-purple-300 text-xs font-medium">System Status</p>
              <p className="text-green-400 text-sm font-bold">● Online</p>
            </div>
            <div className="bg-purple-800/30 p-3 rounded-lg border border-purple-600/30">
              <p className="text-purple-300 text-xs font-medium">Security Level</p>
              <p className="text-green-400 text-sm font-bold">Maximum</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-purple-200">
            Need different access?{" "}
            <Link to="/login" className="text-purple-300 hover:text-purple-100 font-medium underline">
              Customer Portal
            </Link>
          </p>
          <p className="text-purple-200">
            <Link to="/seller/login" className="text-purple-300 hover:text-purple-100 font-medium underline">
              Seller Portal →
            </Link>
          </p>
          <div className="mt-4 pt-4 border-t border-purple-700/30">
            <p className="text-purple-400 text-xs">
              © 2026 E-Commerce Admin System | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
