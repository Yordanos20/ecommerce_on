// src/components/Card.js
export default function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}