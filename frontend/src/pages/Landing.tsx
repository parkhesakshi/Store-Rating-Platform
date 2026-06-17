import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

import { Star, Store, Users, BarChart3, ArrowRight } from "lucide-react";

import HeroImage from "../assets/Hero-image.jpg";

const Landing = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/public-stats");
      return res.data;
    },
  });
  return (
    <>
      <Navbar />

      <section className="pt-32 lg:pt-40 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                ⭐ Trusted By Thousands
              </div>

              <h1 className="mt-8 text-5xl lg:text-7xl font-extrabold leading-tight">
                Customer
                <span className="block text-indigo-600">Reviews</span>
              </h1>

              <p className="mt-8 text-xl text-gray-600 leading-relaxed">
                Discover trusted stores, share your experiences, and help
                customers make smarter decisions with authentic ratings and
                reviews.
              </p>

              <div className="mt-10 flex flex-wrap gap-5">
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition"
                >
                  Get Started
                  <ArrowRight size={20} />
                </Link>
              </div>

              <div className="mt-10 flex gap-3">
                <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            {/* Right */}
            <div className="flex justify-center">
              <img
                src={HeroImage}
                alt="Customer Reviews"
                className="w-full max-w-[700px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <Users size={50} className="mx-auto text-indigo-600" />

              <h3 className="mt-4 text-4xl font-bold">{isLoading ? "..." : `${stats?.users ?? 0}+`}+</h3>

              <p className="text-gray-500 mt-2">Active Users</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <Store size={50} className="mx-auto text-indigo-600" />

              <h3 className="mt-4 text-4xl font-bold">{isLoading ? "..." : `${stats?.stores ?? 0}+`}+</h3>

              <p className="text-gray-500 mt-2">Registered Stores</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <Star size={50} className="mx-auto text-indigo-600" />

              <h3 className="mt-4 text-4xl font-bold">{isLoading ? "..." : `${stats?.ratings ?? 0}+`}+</h3>

              <p className="text-gray-500 mt-2">Ratings Submitted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center">
            <h2 className="text-5xl font-bold">Why Choose StoreRating?</h2>

            <p className="mt-4 text-gray-600 text-lg">
              Everything you need to discover and rate stores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition">
              <Star size={50} className="text-yellow-500" />

              <h3 className="mt-5 text-2xl font-semibold">Authentic Ratings</h3>

              <p className="mt-3 text-gray-600">
                Genuine customer feedback and trustworthy reviews.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition">
              <Store size={50} className="text-indigo-600" />

              <h3 className="mt-5 text-2xl font-semibold">Verified Stores</h3>

              <p className="mt-3 text-gray-600">
                Browse trusted stores from various categories.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition">
              <BarChart3 size={50} className="text-green-600" />

              <h3 className="mt-5 text-2xl font-semibold">Smart Analytics</h3>

              <p className="mt-3 text-gray-600">
                Insights and statistics for better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold text-white">
            Ready to Start Rating?
          </h2>

          <p className="mt-6 text-xl text-indigo-100">
            Join thousands of users discovering trusted stores every day.
          </p>

          <Link
            to="/register"
            className="inline-block mt-10 px-10 py-5 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-gray-100"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Landing;
