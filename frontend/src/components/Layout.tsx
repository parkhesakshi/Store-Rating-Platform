import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  Store,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },

    {
      label: "Stores",
      icon: Store,
      path: "/dashboard/stores",
    },
  ];

  if (user?.role === "ADMIN") {
    menuItems.push({
      label: "Users",
      icon: Users,
      path: "/dashboard/users",
    });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Header */}

      <div className="lg:hidden bg-white shadow px-4 py-4 flex justify-between items-center">
        <h2 className="font-bold text-xl text-indigo-600">
          StoreRating
        </h2>

        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* Mobile Sidebar */}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="w-72 h-full bg-white p-6">
            <div className="flex justify-between mb-8">
              <h2 className="font-bold text-xl">
                StoreRating
              </h2>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3"
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="mt-6 flex items-center gap-3 text-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}

        <aside className="hidden lg:flex flex-col w-72 bg-white shadow min-h-screen">
          <div className="p-6 border-b">
            <h1 className="font-bold text-2xl text-indigo-600">
              StoreRating
            </h1>
          </div>

          <div className="flex-1 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 mb-2"
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t">
            <p className="font-medium">{user?.name}</p>

            <p className="text-sm text-gray-500 mb-4">
              {user?.role}
            </p>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}