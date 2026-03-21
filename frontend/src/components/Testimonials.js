// frontend/src/components/Testimonials.js
export default function Testimonials() {
  const reviews = [
    {
      name: "Alice Johnson",
      quote: "Amazing products and fast delivery! Highly recommend.",
      rating: 5,
      image: "https://source.unsplash.com/80x80/?woman,face",
    },
    {
      name: "Michael Smith",
      quote: "Great customer service and quality items.",
      rating: 4,
      image: "https://source.unsplash.com/80x80/?man,face",
    },
    {
      name: "Sofia Lee",
      quote: "I love shopping here. The website is easy to use!",
      rating: 5,
      image: "https://source.unsplash.com/80x80/?girl,face",
    },
  ];

  return (
    <section className="p-8 mt-10 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-8">⭐ Customer Reviews</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-white p-6 rounded shadow hover:shadow-lg transition flex flex-col items-center text-center">
            <img
              src={review.image}
              alt={review.name}
              className="w-16 h-16 rounded-full mb-3 object-cover"
            />
            <h3 className="font-bold">{review.name}</h3>
            <p className="text-yellow-500 mt-1">
              {"⭐".repeat(review.rating)}
            </p>
            <p className="text-gray-600 mt-2 text-sm">{review.quote}</p>
          </div>
        ))}
      </div>
    </section>
  );
}