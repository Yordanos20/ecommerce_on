// frontend/src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ role, children }) {
  const { token, user } = useContext(AuthContext);

  // 1️⃣ Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ If role is required, check case-insensitive match
  if (role && user?.role && user.role.toLowerCase() !== role.toLowerCase()) {
    // Redirect to appropriate dashboard based on user role instead of just "/"
    const userRole = user.role.toLowerCase();
    if (userRole === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // 3️⃣ Logged in and role matches → allow access
  return children;
}

export default ProtectedRoute;