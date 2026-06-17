import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

const StoreOwnerDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["storeowner-dashboard"],
    queryFn: async () => {
      const res = await api.get("/ratings/owner-dashboard");
      return res.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Store Owner Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Store</h3>
          <p className="text-2xl font-bold">{data?.storeName}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Average Rating</h3>
          <p className="text-2xl font-bold">
            ⭐ {data?.averageRating?.toFixed(1)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Total Ratings</h3>
          <p className="text-2xl font-bold">{data?.totalRatings}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Users Who Rated My Store</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left">Name</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Rating</th>
              </tr>
            </thead>

            <tbody>
              {data?.ratings?.map((rating) => (
                <tr key={rating.id}>
                  <td className="p-4">{rating.user.name}</td>

                  <td className="p-4">{rating.user.email}</td>

                  <td className="p-4">⭐ {rating.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
