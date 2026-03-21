// frontend/src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://ecommerce-backend-ol0h.onrender.com/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);       // User reviews globally
  const [notifications, setNotifications] = useState([]);   // Notifications globally

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

      // Only fetch user reviews and notifications for non-admin users
      if (parsedUser.role?.toLowerCase() !== 'admin') {
        fetchUserReviews(parsedUser.id, storedToken);
        fetchNotifications(parsedUser.id, storedToken);
      }
    }

    setLoading(false);
  }, []);

  // ---------- Session management ----------
  const setSession = (nextToken, nextUser) => {
    console.log("Setting session:", { token: nextToken, user: nextUser });
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    axios.defaults.headers.common.Authorization = `Bearer ${nextToken}`;

    // Only fetch reviews and notifications for non-admin users
    if (nextUser.role?.toLowerCase() !== 'admin') {
      fetchUserReviews(nextUser.id, nextToken);
      fetchNotifications(nextUser.id, nextToken);
    }
  };

  // ---------- User Reviews ----------
  const fetchUserReviews = async (userId = user?.id, authToken = token) => {
    if (!userId || !authToken) return [];
    // Prevent admin users from fetching customer reviews
    if (user?.role?.toLowerCase() === 'admin') return [];
    
    try {
      const res = await axios.get(`${API_BASE}/reviews/user`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUserReviews(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch user reviews", err);
      setUserReviews([]);
      return [];
    }
  };

  // ---------- Notifications ----------
  const fetchNotifications = async (userId = user?.id, authToken = token) => {
    if (!authToken) return [];
    // Prevent admin users from fetching customer notifications
    if (user?.role?.toLowerCase() === 'admin') return [];
    
    try {
      const res = await axios.get(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNotifications(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setNotifications([]);
      return [];
    }
  };

  const markNotificationRead = async (id) => {
    if (!token) return false;
    try {
      await axios.put(`${API_BASE}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local state immediately
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      return true;
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      return false;
    }
  };

  // ---------- Auth Functions ----------
  const register = async (formData) => {
    try {
      const payload = {
        name: formData.name || formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        store_name: formData.storeName,
        phone: formData.phone,
        address: formData.address,
        // Additional seller fields
        store_description: formData.storeDescription,
        business_address: formData.businessAddress,
        business_type: formData.businessType,
        bank_account: formData.bankAccount,
        bank_name: formData.bankName,
        account_holder: formData.accountHolder,
        routing_number: formData.routingNumber,
        tax_id: formData.taxId,
        business_registration: formData.businessRegistration,
      };
      const res = await axios.post(`${API_BASE}/users/register`, payload);
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API_BASE}/users/forgot-password`, { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Failed to send reset code",
      };
    }
  };

  const resetPassword = async (email, code, password) => {
    try {
      const res = await axios.post(`${API_BASE}/users/reset-password`, { email, code, password });
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Failed to reset password",
      };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const res = await axios.post(`${API_BASE}/users/verify-email`, { token });
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Email verification failed",
      };
    }
  };

  const resendVerification = async (email) => {
    try {
      const res = await axios.post(`${API_BASE}/users/resend-verification`, { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Failed to resend verification",
      };
    }
  };

  const login = async (email, password, role = 'customer') => {
    try {
      const res = await axios.post(`${API_BASE}/users/login`, { email, password, role });
      const { token: nextToken, user: nextUser } = res.data;
      setSession(nextToken, nextUser);
      return { success: true, user: nextUser };
    } catch (err) {
      console.error("Login error:", err.response?.data);
      return {
        success: false,
        message: err.response?.data?.error || "Invalid email or password",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserReviews([]);
    setNotifications([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common.Authorization;
  };

  // ---------- Profile Functions ----------
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put(`${API_BASE}/users/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Update failed" };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      await axios.put(`${API_BASE}/users/${user.id}/password`, { password: newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Password update failed" };
    }
  };

  // ---------- Orders ----------
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return [];
    }
  };

  // ---------- Address ----------
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/addresses/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return [];
    }
  };

  const addAddress = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/addresses`, { userId: user.id, ...data }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return null;
    }
  };

  const updateAddress = async (id, data) => {
    try {
      const res = await axios.put(`${API_BASE}/addresses/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return null;
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return null;
    }
  };

  // ---------- Payments ----------
  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payments/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return [];
    }
  };

  const addPayment = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/payments`, {
        order_id: data.order_id,
        payment_method: data.payment_method,
        amount: data.amount,
      }, { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    } catch {
      return null;
    }
  };

  const role = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        userReviews,
        notifications,
        fetchUserReviews,
        fetchNotifications,
        markNotificationRead,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
        updateProfile,
        updatePassword,
        fetchOrders,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        fetchPayments,
        addPayment,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};