export default function PromotionBanner() {
  return (
    <div className="my-6 bg-yellow-200 p-6 rounded-lg text-center">
      <h2 className="text-2xl font-bold">Special Offer: Up to 50% Off!</h2>
      <p className="mt-2">Free shipping on orders over $50</p>
      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
        Shop Deals
      </button>
    </div>
  );
}