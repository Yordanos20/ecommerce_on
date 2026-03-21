// frontend/src/components/AdminLayout.js
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiShoppingBag, FiBox, FiDollarSign, FiSettings, FiLogOut } from "react-icons/fi";
import "./AdminLayout.css";

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>
        <ul>
          <li className={isActive("/admin/dashboard") ? "active" : ""}>
            <Link to="/admin/dashboard"><FiHome className="icon" /> Dashboard</Link>
          </li>
          <li className={isActive("/admin/users") ? "active" : ""}>
            <Link to="/admin/users"><FiUsers className="icon" /> Users</Link>
          </li>
          <li className={isActive("/admin/sellers") ? "active" : ""}>
            <Link to="/admin/sellers"><FiUsers className="icon" /> Sellers</Link>
          </li>
          <li className={isActive("/admin/products") ? "active" : ""}>
            <Link to="/admin/products"><FiBox className="icon" /> Products</Link>
          </li>
          <li className={isActive("/admin/orders") ? "active" : ""}>
            <Link to="/admin/orders"><FiShoppingBag className="icon" /> Orders</Link>
          </li>
          <li className={isActive("/admin/revenue") ? "active" : ""}>
            <Link to="/admin/revenue"><FiDollarSign className="icon" /> Revenue</Link>
          </li>
          <li className={isActive("/admin/settings") ? "active" : ""}>
            <Link to="/admin/settings"><FiSettings className="icon" /> Settings</Link>
          </li>
          <li>
            <Link to="/admin/login" onClick={handleLogout}><FiLogOut className="icon" /> Logout</Link>
          </li>
        </ul>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
