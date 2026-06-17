import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Star, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/error-handler";

interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
  ownerId: string;
  averageRating?: number;
  totalRatings?: number;
  owner?: {
    name: string;
    email: string;
  };
}

const Stores: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "address">("name");

  const {
    data: stores,
    refetch,
    isLoading,
    error,
  } = useQuery<Store[]>({
    queryKey: ["stores", searchTerm, searchType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append(searchType, searchTerm);
      }
      const response = await api.get(`/stores?${params.toString()}`);
      return response.data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading stores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">
          {getErrorMessage(error, "Failed to load stores")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stores</h1>
        {(user?.role === "ADMIN" || user?.role === "STORE_OWNER") && (
          <Button onClick={() => navigate("/dashboard/stores/new")}>
            Add New Store
          </Button>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "name" | "address")}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="name">By Name</option>
          <option value="address">By Address</option>
        </select>
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {stores && stores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No stores found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores?.map((store) => (
            <Card
              key={store.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/dashboard/stores/${store.id}`)}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {store.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{store.address}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {Number(store.averageRating || 0).toFixed(1)}
                  </span>
                  <div className="flex">
                    {renderStars(store.averageRating || 0)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({store.totalRatings || 0} ratings)
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Owner: {store.owner?.name || "N/A"}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stores;
