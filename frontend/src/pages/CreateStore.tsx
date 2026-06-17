/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { ArrowLeft } from "lucide-react";
import { getErrorMessage } from "../lib/error-handler";
import { useQuery } from "@tanstack/react-query";

const storeSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  address: z.string().max(400),
  ownerId: z.string().min(1, "Select store owner"),
});

type StoreFormData = z.infer<typeof storeSchema>;

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { data: owners = [] } = useQuery({
    queryKey: ["storeOwners"],
    queryFn: async () => {
      const response = await api.get("/users/store-owners");
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: StoreFormData) => {
      console.log(data);
      const response = await api.post("/stores", data);
      return response.data;
    },
    onSuccess: () => {
      navigate("/dashboard/stores");
    },
    onError: (error) => {
      setError(getErrorMessage(error, "Failed to create store"));
    },
  });

  const onSubmit = (data: StoreFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate("/stores")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Stores
      </Button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Store</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <Label htmlFor="name">Store Name</Label>
            <Input
              id="name"
              {...register("name")}
              error={errors.name?.message}
              placeholder="Enter store name"
            />
          </div>

          <div>
            <Label htmlFor="email">Store Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              placeholder="Enter store email"
            />
          </div>

          <div>
            <Label htmlFor="address">Store Address</Label>
            <Input
              id="address"
              {...register("address")}
              error={errors.address?.message}
              placeholder="Enter store address (max 400 characters)"
            />
          </div>
          <div>
            <Label htmlFor="ownerId">Store Owner</Label>

            <select
              id="ownerId"
              {...register("ownerId")}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Store Owner</option>

              {owners.map((owner: any) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>

            {errors.ownerId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ownerId.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/dashboard/stores")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create Store"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;
