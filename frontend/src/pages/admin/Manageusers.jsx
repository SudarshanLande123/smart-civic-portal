import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

import {
  getAllUsers,
  updateUserRole,
  activateUser,
  deactivateUser,
  deleteUser,
} from "../../services/userManagementService";

const roleOptions = ["citizen", "admin", "superadmin"];

const roleBadgeStyles = {
  citizen: "bg-gray-100 text-gray-700",
  admin: "bg-blue-100 text-blue-700",
  superadmin: "bg-purple-100 text-purple-700",
};

const ManageUsers = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Track which user row has an action in flight, to disable just that row
  const [actingOnId, setActingOnId] = useState(null);

  const loadUsers = async (searchTerm = "") => {
    try {
      setLoading(true);
      const data = await getAllUsers(searchTerm);
      setUsers(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = () => {
    loadUsers(search.trim());
  };

  const handleRoleChange = async (user, newRole) => {
    if (newRole === user.role) return;

    try {
      setActingOnId(user._id);
      await updateUserRole(user._id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)),
      );
      toast.success("Role updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setActingOnId(null);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      setActingOnId(user._id);
      const nextStatus = !user.isActive;

      if (nextStatus) {
        await activateUser(user._id);
      } else {
        await deactivateUser(user._id);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: nextStatus } : u,
        ),
      );
      toast.success(nextStatus ? "User activated" : "User deactivated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setActingOnId(null);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete ${user.name}? This can't be undone.`,
    );
    if (!confirmed) return;

    try {
      setActingOnId(user._id);
      await deleteUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success("User deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setActingOnId(null);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 border rounded-lg p-3"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg whitespace-nowrap"
        >
          Search
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-sm">No users found.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const isSelf = user._id === userInfo?._id;
            const isActing = actingOnId === user._id;

            return (
              <div
                key={user._id}
                className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold truncate">{user.name}</p>
                    {isSelf && (
                      <span className="text-xs text-gray-400">(you)</span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        roleBadgeStyles[user.role] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm truncate">{user.email}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user, e.target.value)}
                    disabled={isSelf || isActing}
                    className="border rounded-lg p-2 text-sm disabled:opacity-50"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleToggleStatus(user)}
                    disabled={isSelf || isActing}
                    className="text-sm border rounded-lg px-3 py-2 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => handleDelete(user)}
                    disabled={isSelf || isActing}
                    className="text-sm bg-red-50 text-red-600 rounded-lg px-3 py-2 hover:bg-red-100 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageUsers;
