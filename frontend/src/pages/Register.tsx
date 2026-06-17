import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "../context/AuthContext";

import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";

import { getErrorMessage } from "../lib/error-handler";

const registerSchema = z.object({
  name: z.string().min(10).max(60),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(16)
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
      "Password must contain uppercase and special character"
    ),
  address: z.string().min(5).max(400),
  role: z.enum(["USER", "STORE_OWNER"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();

  const { register: registerUser } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      role: "USER",
    },
  });

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      setLoading(true);
      setError("");

      await registerUser(data);

      navigate("/login");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Registration failed"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 overflow-hidden bg-slate-50">

      <div className="hidden lg:flex bg-indigo-600 items-center justify-center text-white p-12">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6">
            Join StoreRating
          </h1>

          <p className="text-lg text-indigo-100">
            Discover stores and share your experience.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">
              Create Account
            </h2>

            <p className="text-slate-500">
              Get started today
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div>
              <Label>Name</Label>

              <Input
                {...register("name")}
                placeholder="Full Name"
                error={errors.name?.message}
              />
            </div>

            <div>
              <Label>Email</Label>

              <Input
                type="email"
                {...register("email")}
                placeholder="Email Address"
                error={errors.email?.message}
              />
            </div>

            <div>
              <Label>Password</Label>

              <Input
                type="password"
                {...register("password")}
                placeholder="Password"
                error={errors.password?.message}
              />
            </div>

            <div>
              <Label>Address</Label>

              <Input
                {...register("address")}
                placeholder="Address"
                error={errors.address?.message}
              />
            </div>

            <div>
              <Label>Role</Label>

              <Select
                defaultValue="USER"
                onValueChange={(value) =>
                  setValue(
                    "role",
                    value as
                      | "USER"
                      | "STORE_OWNER"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="USER">
                    Normal User
                  </SelectItem>

                  <SelectItem value="STORE_OWNER">
                    Store Owner
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm mt-6 text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;