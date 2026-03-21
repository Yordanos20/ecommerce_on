export default function Newsletter() {
  return (
    <div className="bg-gray-100 p-6 rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
      <p className="mb-4">Get updates and exclusive discounts</p>
      <div className="flex justify-center gap-2">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="p-2 border rounded-l-lg w-64"
        />
        <button className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition">Subscribe</button>
      </div>
    </div>
  );
}