import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Eye } from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/dashboard/users")}
        className="mb-4 px-4 py-2 border rounded"
      >
        Back
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Name</label>
            <p>{user.name}</p>
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <p>{user.email}</p>
          </div>

          <div>
            <label className="font-semibold">Address</label>
            <p>{user.address}</p>
          </div>

          <div>
            <label className="font-semibold">Role</label>
            <p>{user.role}</p>
          </div>

          {user.store && (
            <div>
              <label className="font-semibold">Assigned Store</label>
              <p>{user.store.name}</p>
            </div>
          )}
          <td className="p-4">
            <button
              onClick={() => navigate(`/dashboard/users/${user.id}`)}
              className="text-indigo-600 flex items-center gap-1"
            >
              <Eye size={16} />
              View
            </button>
          </td>
        </div>
      </div>
    </div>
  );
}
