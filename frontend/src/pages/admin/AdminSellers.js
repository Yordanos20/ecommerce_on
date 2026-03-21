import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const token = localStorage.getItem("adminToken");

  const fetchSellers = async () => {
    try {
      const res = await axios.get("/api/admin/sellers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSellers(res.data || []);
    } catch {
      toast.error("Failed to load sellers");
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const updateApproval = async (id, approval_status) => {
    try {
      await axios.put(
        `/api/admin/sellers/${id}/approval`,
        { approval_status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSellers();
    } catch {
      toast.error("Failed to update seller status");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Sellers</h2>
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Seller</th>
              <th className="p-3 text-left">Store</th>
              <th className="p-3 text-left">Business ID</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.name} ({s.email})</td>
                <td className="p-3">{s.store_name}</td>
                <td className="p-3">{s.business_id || "-"}</td>
                <td className="p-3">{s.approval_status}</td>
                <td className="p-3 flex gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => updateApproval(s.id, "Approved")}>Approve</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => updateApproval(s.id, "Rejected")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
