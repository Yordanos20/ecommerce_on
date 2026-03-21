// frontend/src/components/TrustIndicators.js
export default function TrustIndicators() {
  const indicators = [
    { icon: "🚚", title: "Free Shipping", description: "On all orders over $50" },
    { icon: "💳", title: "Secure Payment", description: "100% encrypted transactions" },
    { icon: "🔄", title: "Easy Returns", description: "Hassle-free returns within 7 days" },
    { icon: "📞", title: "24/7 Support", description: "We’re here for you anytime" },
  ];

  return (
    <section className="p-8 mt-10 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
        {indicators.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white p-6 rounded shadow hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}