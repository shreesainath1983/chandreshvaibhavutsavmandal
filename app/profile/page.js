"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "./profileService";
import { getStoredUser, isUserLoggedIn } from "../authUtils";

export default function Profile() {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (!isUserLoggedIn()) {
      router.push("/login");
    } else {
      const storedUser = getStoredUser();
      setId(storedUser?.id);
      setName(storedUser?.name);
      setEmail(storedUser?.email);
      setDesignation(storedUser?.designation?.designation || "N/A");
      setRole(
        storedUser?.role_id === 1
          ? "Admin"
          : storedUser?.role_id === 3
            ? "Contributor"
            : "User",
      );
    }
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    } else if (!oldPassword || !password) {
      alert("Please fill in all password fields");
      return;
    } else if (oldPassword === password) {
      alert("New password cannot be the same as old password");
      return;
    }
    setLoading(true);
    try {
      const result = await resetPassword(id, oldPassword, password);
      if (result.ok && result.message) {
        alert(result.message);
        // Clear user data and redirect to login
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        alert(result.error || "Something went wrong");
      }
    } catch (err) {
      alert(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-red-400 to-purple-400 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6"
      >
        <div className="text-left border-b border-gray-200 pb-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600 text-sm">Your profile information</p>
        </div>
        <div className="space-y-4">
          <table className="w-full text-left mb-6">
            <tbody>
              <tr>
                <td className="font-semibold text-gray-700 py-2">Name:</td>
                <td className="text-gray-600 py-2">{name}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 py-2">Email:</td>
                <td className="text-gray-600 py-2">{email}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 py-2">
                  Designation:
                </td>
                <td className="text-gray-600 py-2">{designation}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 py-2">Role:</td>
                <td className="text-gray-600 py-2">{role}</td>
              </tr>
            </tbody>
          </table>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
            placeholder="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
            placeholder="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
            placeholder="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
