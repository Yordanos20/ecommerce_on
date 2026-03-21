// frontend/src/pages/seller/Payments.js
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { BASE_URL } from "../../services/api";

const Payments = () => {
  const { token, user } = useContext(AuthContext); // get current seller
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payments for the current seller
  const fetchPayments = async () => {
    if (!token || !user) return;
    setLoading(true);

    try {
      const res = await axios.get(`${BASE_URL}/payments/seller/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token, user]);

  if (loading) return <div className="p-10 text-xl">Loading payments...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Payment Tracking
      </h2>

      {payments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Payment ID</th>
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Amount ($)</th>
                <th className="py-2 px-4 text-left">Method</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-4">{p.id}</td>
                  <td className="py-2 px-4">{p.order_id}</td>
                  <td className="py-2 px-4">${Number(p.amount || 0).toFixed(2)}</td>
                  <td className="py-2 px-4">{p.payment_gateway || "-"}</td>
                  <td className="py-2 px-4 capitalize">{p.status}</td>
                  <td className="py-2 px-4">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;