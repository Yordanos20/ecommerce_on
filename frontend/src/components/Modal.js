import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function Modal({ title, icon, children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl transition"
        >
          <FiX />
        </button>

        <div className="flex items-center gap-3 mb-4">
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        <div className="text-gray-700 dark:text-gray-300 space-y-3">{children}</div>
      </motion.div>
    </motion.div>
  );
}