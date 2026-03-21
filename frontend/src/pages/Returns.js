import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../services/api";

export default function Returns() {
  const [returns, setReturns] = useState([]);
  const [reason, setReason] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    api.get("/returns")
      .then((res) => setReturns(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error fetching returns:", err);
        setReturns([]);
      });
  }, []);

  const requestReturn = async () => {
    if (!orderId) {
      toast.error("Please enter order ID");
      return;
    }
    try {
      const res = await api.post("/returns", { order_id: parseInt(orderId), reason });
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message || "Return request submitted!");
        setReturns([...returns, { order_id: orderId, reason, status: "requested" }]);
        setOrderId("");
        setReason("");
      } else {
        toast.error(res.data.error || "Request failed");
      }
    } catch (e) {
      toast.error(e.response?.data?.error || "Request failed");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Returns</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Request a Return</h3>
        <input
          type="number"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Reason for return"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <button
          onClick={requestReturn}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Return Request
        </button>
      </div>

      <h3 className="font-semibold mb-2">Your Return Requests</h3>
      {returns.length === 0 ? (
        <p className="text-gray-500">No return requests yet.</p>
      ) : (
        <div className="space-y-4">
          {returns.map((r) => (
            <div key={r.id} className="p-4 bg-white rounded-lg shadow border">
              <p>Order #{r.order_id} | Reason: {r.reason || "-"}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${r.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : r.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                Status: {r.status || "requested"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
