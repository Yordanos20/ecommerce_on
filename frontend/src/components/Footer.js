import { useState } from "react";
import Modal from "./Modal";
import { FiInfo, FiPhone, FiShield, FiFileText } from "react-icons/fi";

export default function Footer() {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (type) => {
    switch (type) {
      case "about":
        setModalContent({
          title: "About My Marketplace",
          icon: <FiInfo />,
          body: (
            <>
              <p>
                <strong>My Marketplace</strong> is your one-stop shop for electronics, fashion, home essentials, and books.
              </p>
              <p>We provide fast shipping, secure payments, and excellent customer service worldwide.</p>
              <p className="mt-2 text-sm text-gray-500">Founded in 2024, trusted by thousands of happy customers.</p>
            </>
          ),
        });
        break;
      case "contact":
        setModalContent({
          title: "Contact Us",
          icon: <FiPhone />,
          body: (
            <>
              <p>Email: <a href="mailto:support@mymarketplace.com" className="text-indigo-600 hover:underline">support@mymarketplace.com</a></p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Support Hours: Mon-Fri, 9 AM - 6 PM</p>
            </>
          ),
        });
        break;
      case "privacy":
        setModalContent({
          title: "Privacy Policy",
          icon: <FiShield />,
          body: (
            <>
              <p>
                Your privacy is our top priority. All personal information is securely stored and never shared without consent.
              </p>
              <p className="mt-2">
                Read full policy at <a href="#" className="text-indigo-600 hover:underline">mymarketplace.com/privacy</a>.
              </p>
            </>
          ),
        });
        break;
      case "terms":
        setModalContent({
          title: "Terms of Service",
          icon: <FiFileText />,
          body: (
            <>
              <p>
                By using My Marketplace, you agree to our terms including payments, shipping, and returns.
              </p>
              <p className="mt-2">
                Full terms at <a href="#" className="text-indigo-600 hover:underline">mymarketplace.com/terms</a>.
              </p>
            </>
          ),
        });
        break;
      default:
        setModalContent(null);
    }
  };

  const closeModal = () => setModalContent(null);

  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* About Section */}
          <div>
            <h3
              className="font-bold text-lg mb-2 cursor-pointer hover:text-indigo-400 transition flex items-center gap-2"
              onClick={() => openModal("about")}
            >
              <FiInfo /> About Us
            </h3>
            <p className="text-sm text-gray-400">Learn more about our mission, story, and values.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-2">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-400">
              {[
                { label: "Contact", type: "contact", icon: <FiPhone /> },
                { label: "Privacy Policy", type: "privacy", icon: <FiShield /> },
                { label: "Terms of Service", type: "terms", icon: <FiFileText /> },
              ].map(link => (
                <li
                  key={link.type}
                  onClick={() => openModal(link.type)}
                  className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 hover:scale-105 transform transition"
                >
                  {link.icon} {link.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-bold text-lg mb-2">Follow Us</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition">Facebook</a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">Instagram</a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Twitter</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} My Marketplace. All rights reserved.
        </div>
      </footer>

      {/* Modal */}
      {modalContent && (
        <Modal
          title={modalContent.title}
          icon={modalContent.icon}
          onClose={closeModal}
        >
          {modalContent.body}
        </Modal>
      )}
    </>
  );
}