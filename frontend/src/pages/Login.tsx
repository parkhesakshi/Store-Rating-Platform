import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

import { getErrorMessage } from "../lib/error-handler";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError("");

      const loggedInUser = await login({
        email: data.email,
        password: data.password,
      });

      if (loggedInUser.role === "ADMIN") {
        navigate("/dashboard");
      } else if (loggedInUser.role === "STORE_OWNER") {
        navigate("/owner-dashboard");
      } else {
        navigate("/dashboard/stores");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex bg-indigo-600 items-center justify-center text-white p-12">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>

          <p className="text-lg text-indigo-100">
            Sign in to manage stores, ratings and analytics.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>

            <p className="text-slate-500 mt-2">Access your account</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Input
                placeholder="Email Address"
                type="email"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <div>
              <Input
                placeholder="Password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm mt-6 text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
