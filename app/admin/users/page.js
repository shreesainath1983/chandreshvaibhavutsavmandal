"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllUsers,
  addUser,
  fetchRoles,
  fetchDesignation,
} from "./userService";
import { isUserLoggedIn, getStoredUser, isAdmin } from "../../authUtils";

export default function UsersManagement() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const defaultFormData = {
    name: "",
    designation_id: "4",
    email: "",
    mobile: "",
    password: "",
    role_id: "2",
    is_lock: true,
  };

  const [formData, setFormData] = useState(defaultFormData);

  const createEmail = (name) => {
    if (!name) return "";
    const emailPrefix = name.toLowerCase().replace(/\s+/g, ".");
    return `${emailPrefix}@cvum.com`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        email: createEmail(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      return;
    }

    if (users.find((u) => u.email === formData.email)) {
      setError("A member with this email already exists");
      return;
    }

    setLoading(true);
    try {
      const result = await addUser({
        ...formData,
        password: setDefaultPassword(formData.email, formData.mobile),
        role_id: parseInt(formData.role_id),
        designation_id: parseInt(formData.designation_id),
      });
      if (result.ok && result.data) {
        setSuccess("Member added successfully!");
        setFormData(defaultFormData);
        // Refresh users list
        await loadUsers();
      } else {
        setError(result.error || "Failed to add a member");
      }
    } catch (err) {
      setError("Failed to add a member");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const result = await fetchAllUsers();
      if (result.ok && result.data) {
        if (!isAdmin(getStoredUser())) {
          // If not admin, filter out admin users from the list
          result.data = result.data.filter((user) => user.role?.role_id !== 1);
        }
        setUsers(result.data);
      } else {
        setError(result.error || "Failed to load users");
      }
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const result = await fetchRoles();
      if (result.ok && result.data) {
        const roleList = isAdmin(getStoredUser())
          ? result.data
          : result.data.filter((role) => role.role_id !== 1);
        setRoles(
          roleList?.map((role) => ({
            id: role.role_id?.toString(),
            name: role.role_name,
          })) || [],
        );
      } else {
        setError(result.error || "Failed to load roles");
      }
    } catch (err) {
      setError("Failed to load roles");
      console.error(err);
    }
  };

  const fetchUserDesignation = async () => {
    try {
      const result = await fetchDesignation();
      if (result.ok && result.data) {
        setDesignations(
          result.data?.map((designation) => ({
            id: designation.id?.toString(),
            name: designation.designation,
          })) || [],
        );
      } else {
        setError(result.error || "Failed to load designations");
      }
    } catch (err) {
      setError("Failed to load designations");
      console.error(err);
    }
  };

  const setDefaultPassword = (email, mobile) => {
    const emailPart = email.split("@")[0];
    const mobilePart = mobile ? mobile.slice(-4) : "0000";
    return `${emailPart}@${mobilePart}`;
  };

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!isUserLoggedIn()) {
      router.push("/login");
      return;
    }

    const storedUser = getStoredUser();
    if (!isAdmin(storedUser) && storedUser.role_id !== 3) {
      router.push("/donors");
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (isAuthorized) {
      fetchUserDesignation();
      fetchUserRoles();
      loadUsers();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Manage users and assign roles</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Add New Member
              </h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Designation *
                  </label>
                  <select
                    name="designation_id"
                    value={formData.designation_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {designations.map((designation) => (
                      <option key={designation.id} value={designation.id}>
                        {designation.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Login *
                  </label>
                  <select
                    name="is_lock"
                    value={formData.is_lock}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={false}>Yes</option>
                    <option value={true}>No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-2 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add User"}
                </button>
              </form>
            </div>
          </div>

          {/* Users Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Existing Members ({users.length})
              </h2>
              {users.length > 0 ? (
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-4 py-3 text-left font-semibold text-gray-800">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-800">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-800">
                          Designation
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-800">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-800">
                          Mobile
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-800">
                          Password
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-800">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-200 transition ${
                            user.is_lock ? "bg-red-100" : "hover:bg-blue-50"
                          }`}
                        >
                          <td className="px-4 py-3 text-gray-700">{user.id}</td>
                          <td className="px-4 py-3 text-gray-700">
                            {user.name}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {user.designation?.designation || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {user.mobile || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {"••••••••"}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                user.role?.role_id === 1
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role?.role_id === 1 ? "Admin" : "User"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-600 text-lg">No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
