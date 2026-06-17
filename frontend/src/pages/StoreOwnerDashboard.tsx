import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Card } from "../components/ui/Card";
import { Star, Users } from "lucide-react";

interface RatedUser {
  id: string;
  name: string;
  email: string;
  rating: number;
}

interface OwnerDashboardData {
  averageRating: number;
  totalRatings: number;
  ratedUsers: RatedUser[];
}

const OwnerDashboard = () => {
  const { data, isLoading } =
    useQuery<OwnerDashboardData>({
      queryKey: ["storeowner-dashboard"],
      queryFn: async () => {
        const response = await api.get(
          "/store-owner/dashboard"
        );

        return response.data;
      },
    });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Store Owner Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <Star
                size={40}
                className="text-yellow-500"
              />

              <div>
                <p className="text-gray-500">
                  Average Rating
                </p>

                <h2 className="text-3xl font-bold">
                  {data?.averageRating ?? 0}
                </h2>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <Users
                size={40}
                className="text-indigo-600"
              />

              <div>
                <p className="text-gray-500">
                  Total Ratings
                </p>

                <h2 className="text-3xl font-bold">
                  {data?.totalRatings ?? 0}
                </h2>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Users Who Rated Your Store
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">
                  Name
                </th>

                <th className="text-left py-3">
                  Email
                </th>

                <th className="text-left py-3">
                  Rating
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.ratedUsers?.map((user) => (
                <tr
                  key={user.id}
                  className="border-b"
                >
                  <td className="py-3">
                    {user.name}
                  </td>

                  <td className="py-3">
                    {user.email}
                  </td>

                  <td className="py-3">
                    ⭐ {user.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OwnerDashboard;