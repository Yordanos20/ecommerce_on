import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    try {
      await axios.put(
        `/api/admin/users/${user.id}/status`,
        { is_active: !user.is_active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.is_active ? "Active" : "Blocked"}</td>
                <td className="p-3 flex gap-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={() => toggleStatus(u)}>
                    {u.is_active ? "Block" : "Activate"}
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => deleteUser(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
