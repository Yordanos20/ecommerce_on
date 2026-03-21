// frontend/src/components/CategoryCard.js
export default function CategoryCard({ title, image }) {
  return (
    <div className="border rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 overflow-hidden cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-36 object-cover transform transition-transform duration-300 hover:scale-105"
        />
        {/* Optional overlay for future use */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition duration-300"></div>
      </div>
      <h3 className="text-center font-semibold mt-2 p-2 text-gray-800 dark:text-gray-200">
        {title}
      </h3>
    </div>
  );
}