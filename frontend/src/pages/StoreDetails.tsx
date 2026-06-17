import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../services/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Star, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RatingForm from "../components/RatingForm";
import { getErrorMessage } from "../lib/error-handler";

interface Rating {
  id: string;
  score: number;
  userId: string;
  storeId: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  averageRating?: number;
  totalRatings?: number;
  ratings?: Rating[];
  owner?: {
    name: string;
    email: string;
    address: string;
  };
}

const StoreDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showRatingForm, setShowRatingForm] = useState(false);

  const {
    data: store,
    isLoading,
    error: storeError,
  } = useQuery<Store>({
    queryKey: ["store", id],
    queryFn: async () => {
      const response = await api.get(`/stores/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: userRating } = useQuery<Rating | null>({
    queryKey: ["user-rating", id],
    queryFn: async () => {
      if (!user) return null;
      try {
        const response = await api.get(`/ratings/user/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!user && !!id,
  });

  const { averageRating, totalRatings } = useMemo(() => {
    const ratings = store?.ratings ?? [];

    const totalRatings = ratings.length;

    const averageRating =
      totalRatings > 0
        ? ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings
        : 0;

    return {
      averageRating,
      totalRatings,
    };
  }, [store?.ratings]);

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
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
        <div className="text-gray-500">Loading store details...</div>
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">
          {getErrorMessage(storeError, "Store not found")}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/dashboard/stores")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stores
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate("/dashboard/stores")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Stores
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Info */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {store.name}
              </h1>
              <p className="text-gray-600 mb-4">{store.address}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-700">
                  {Number(averageRating || 0).toFixed(1)}
                </span>
                <div className="flex">{renderStars(averageRating || 0)}</div>
                <span className="text-sm text-gray-500">
                  ({totalRatings || 0} ratings)
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Owner: {store.owner?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-500">Email: {store.email}</div>

              {user && user.role === "USER" && (
                <div className="mt-6">
                  {userRating ? (
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Your Rating:</span>
                      <div className="flex">
                        {renderStars(userRating.score)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRatingForm(true)}
                      >
                        Update Rating
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setShowRatingForm(true)}>
                      Rate This Store
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Ratings List */}
        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Ratings
              </h2>
              {store.ratings && store.ratings.length > 0 ? (
                <div className="space-y-4">
                  {store.ratings.slice(0, 5).map((rating) => (
                    <div
                      key={rating.id}
                      className="border-b pb-3 last:border-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">{renderStars(rating.score)}</div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {rating.user?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No ratings yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Rating Form Modal */}
      {showRatingForm && id && (
        <RatingForm
          storeId={id}
          existingRating={userRating}
          onClose={() => setShowRatingForm(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["store", id] });
            queryClient.invalidateQueries({ queryKey: ["user-rating", id] });
            setShowRatingForm(false);
          }}
        />
      )}
    </div>
  );
};

export default StoreDetails;
