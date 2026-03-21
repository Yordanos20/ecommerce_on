import { FaHome, FaBoxOpen, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ role }) {
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", icon: <FaHome />, path: "/" },
    { name: "Orders", icon: <FaBoxOpen />, path: "/orders" },
    { name: "Wishlist", icon: <FaHeart />, path: "/wishlist" },
    { name: "Cart", icon: <FaShoppingCart />, path: "/cart" },
    { name: "Profile", icon: <FaUser />, path: "/profile" },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen hidden md:flex flex-col p-4">
      <h1
        className="text-2xl font-bold mb-8 cursor-pointer text-blue-400"
        onClick={() => navigate("/")}
      >
        MyShop
      </h1>
      <nav className="flex flex-col gap-2">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => navigate(link.path)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            {link.icon} <span className="font-medium">{link.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}