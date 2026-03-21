// frontend/src/pages/Login.js
import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "customer",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password ❌");
      return;
    }

    setLoading(true);
    try {
      const res = await login(formData.email, formData.password, formData.role);

      if (res.success) {
        const userRole = res.user.role.toLowerCase();
        console.log("Login successful - User role:", userRole);
        console.log("User data:", res.user);
        
        // Allow both customer and seller roles
        if (userRole === 'customer' || userRole === 'seller') {
          toast.success("Login successful ✅");

          // Remember me functionality
          if (rememberMe) localStorage.setItem("rememberedEmail", formData.email);
          else localStorage.removeItem("rememberedEmail");

          // Redirect based on role
          if (userRole === 'customer') {
            console.log("Redirecting customer to home");
            navigate("/");
          } else {
            console.log("Redirecting seller to dashboard");
            navigate("/seller/dashboard");
          }
        } else {
          toast.error("Access denied. Please use the correct login portal ❌");
        }
      } else {
        toast.error(res.message || "Login failed ❌");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* Customer Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Login As
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">Remember Me</span>
              </label>

              <Link to="/forgot-password" className="text-green-600 hover:underline text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Unified Benefits Section */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="text-sm text-green-800 dark:text-green-200">
              <p className="font-medium mb-2">Account Benefits:</p>
              <ul className="space-y-1">
                <li>• Track orders and manage account</li>
                <li>• Save wishlist and favorites</li>
                <li>• Quick checkout process</li>
                <li>• Access to exclusive deals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
            Forgot your password?
          </Link>
        </div>

        {/* Register Link */}
        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 hover:text-green-700 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
