import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

const StoreOwnerDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["store-owner-dashboard"],
    queryFn: async () => {
      const response = await api.get(
        "/store-owner/dashboard"
      );

      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Store Owner Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500">
            Average Rating
          </h2>

          <p className="text-4xl font-bold text-indigo-600 mt-2">
            {data?.averageRating ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500">
            Total Ratings
          </h2>

          <p className="text-4xl font-bold text-indigo-600 mt-2">
            {data?.totalRatings ?? 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
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
              {data?.ratings?.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (rating: any) => (
                  <tr
                    key={rating.id}
                    className="border-b"
                  >
                    <td className="py-3">
                      {rating.user.name}
                    </td>

                    <td className="py-3">
                      {rating.user.email}
                    </td>

                    <td className="py-3">
                      ⭐ {rating.score}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;