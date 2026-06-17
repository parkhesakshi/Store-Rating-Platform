import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const { changePassword } = useAuth();

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await changePassword(
        oldPassword,
        newPassword
      );

      setMessage(
        "Password changed successfully"
      );

      setOldPassword("");
      setNewPassword("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage(
        error.message ||
          "Failed to change password"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">
          Change Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="Old Password"
            className="w-full border p-3 rounded"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-3 rounded"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-3 rounded w-full"
          >
            Change Password
          </button>
        </form>

        {message && (
          <p className="mt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}