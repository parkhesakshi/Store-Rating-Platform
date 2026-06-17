import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const { changePassword } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");

    if (oldPassword === newPassword) {
      setIsError(true);
      setMessage(
        "New password cannot be the same as current password"
      );
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);

      setIsError(false);
      setMessage("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsError(true);
      setMessage(
        error?.response?.data?.message ||
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
            placeholder="Current Password"
            className="w-full border p-3 rounded"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-3 rounded"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-3 rounded w-full hover:bg-indigo-700"
          >
            Change Password
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              isError
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}