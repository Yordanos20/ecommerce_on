import { useEffect, useState } from "react";

import api from "../services/api";

export default function Shipping() {
  const [shippingMethods, setShippingMethods] = useState([]);

  useEffect(() => {
    api.get("/shipping")
      .then((res) => setShippingMethods(res.data))
      .catch((err) => console.error("Error fetching shipping:", err));
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shipping Status</h2>
      {shippingMethods.length === 0 ? (
        <p className="text-gray-500">No shipping records yet.</p>
      ) : (
        <div className="space-y-4">
          {shippingMethods.map((s) => (
            <div
              key={s.id}
              className="p-4 bg-white rounded-lg shadow border"
            >
              <p>
                <span className="font-semibold">Order #</span>
                {s.order_id}
              </p>
              <p className="text-gray-600 mt-1">Address: {s.address}</p>
              {s.city && (
                <p className="text-gray-600">
                  {s.city}
                  {s.state && `, ${s.state}`}
                  {s.zip && ` ${s.zip}`}
                </p>
              )}
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${s.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : s.status === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {s.status || "Pending"}
              </span>
              {s.tracking_number && (
                <p className="mt-2 text-sm">
                  Tracking: {s.tracking_number}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
