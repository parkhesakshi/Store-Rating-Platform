import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowUpDown, Eye } from "lucide-react";
import { api } from "../services/api";
import AddUserModal from "@/components/AddUserModal";

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();

  const [showAddUser, setShowAddUser] = useState(false);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    },
  });

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.address?.toLowerCase().includes(searchTerm) ||
      user.role?.toLowerCase().includes(searchTerm)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = String(a[sortField] || "").toLowerCase();

    const bValue = String(b[sortField] || "").toLowerCase();

    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        Loading Users...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>

          <p className="text-gray-500">Total Users: {filteredUsers.length}</p>
        </div>

        <button
          className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          onClick={() => setShowAddUser(true)}
        >
          Add User
        </button>
      </div>

      {/* Search */}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />

        <input
          type="text"
          placeholder="Search by name, email, address or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg pl-10 pr-4 py-3 bg-white shadow-sm"
        />
      </div>

      {/* Desktop Table */}

      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th
                  className="text-left p-4 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown size={14} />
                  </div>
                </th>

                <th
                  className="text-left p-4 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-2">
                    Email
                    <ArrowUpDown size={14} />
                  </div>
                </th>

                <th
                  className="text-left p-4 cursor-pointer"
                  onClick={() => handleSort("address")}
                >
                  <div className="flex items-center gap-2">
                    Address
                    <ArrowUpDown size={14} />
                  </div>
                </th>

                <th
                  className="text-left p-4 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center gap-2">
                    Role
                    <ArrowUpDown size={14} />
                  </div>
                </th>

                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{user.name}</td>

                    <td className="p-4">{user.email}</td>

                    <td className="p-4">{user.address}</td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs
                        ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "STORE_OWNER"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/dashboard/users/${user.id}`)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}

      <div className="md:hidden space-y-4">
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>

                  <p className="text-sm text-gray-500 break-all">
                    {user.email}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs
                  ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700"
                      : user.role === "STORE_OWNER"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-3">{user.address}</p>

              <button
                onClick={() => navigate(`/dashboard/users/${user.id}`)}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>
      <AddUserModal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSuccess={() => {
          setShowAddUser(false);
        }}
      />
    </div>
  );
};

export default Users;
