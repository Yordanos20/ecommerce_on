import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  if (!user || user.role.toLowerCase() !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  return children;
}