import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";

import Dashboard from "./pages/Dashboard";
import Stores from "./pages/Stores";
import StoreDetails from "./pages/StoreDetails";
import CreateStore from "./pages/CreateStore";
import Users from "./pages/Users";

import Layout from "./components/Layout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="storeowner-dashboard"
            element={<StoreOwnerDashboard />}
          />
          <Route index element={<Dashboard />} />

          <Route path="stores" element={<Stores />} />

          <Route path="stores/new" element={<CreateStore />} />

          <Route path="stores/:id" element={<StoreDetails />} />

          <Route path="users" element={<Users />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
