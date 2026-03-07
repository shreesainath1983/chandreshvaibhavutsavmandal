"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isUserLoggedIn,
  getStoredUser,
  isAdmin,
  canGenerateReport,
} from "../../authUtils";
import { fetchUserVoterdataReport } from "./dashboardService";

export default function Dashboard() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.push("/login");
      return;
    }
    const user = getStoredUser();
    if (!isAdmin(user) && user.role_id !== 3) {
      router.push("/donors");
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  const generateReport = async () => {
    if (!canGenerateReport()) {
      setError(
        "You can't generate a report right now. Please wait a few minutes.",
      );
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetchUserVoterdataReport({
      fromDate,
      toDate,
    });

    if (res.ok) {
      setRows(res.data);
    } else if (res.error) {
      setError("Failed to generate report");
      console.error(res.error);
    } else {
      setRows(res.data || []);
    }

    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 5); // 5 minutes expiration
    localStorage.setItem(
      "report_reset",
      JSON.stringify({ expirationDate: expirationDate.toISOString() }),
    );
    setLoading(false);
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            />
          </div>
          <button
            onClick={generateReport}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
          >
            {loading ? "Checking..." : "Check entries"}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {loading ? (
          <p>Loading report...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">User Activity</h2>
              <>
                <h3 className="text-2xl font-bold">
                  Total entries:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-lg font-semibold bg-blue-100 text-blue-800`}
                  >
                    {rows.reduce((acc, row) => acc + row.total_entries, 0)}
                  </span>
                </h3>
                <h3 className="text-2xl font-bold">
                  Address updated:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-lg font-semibold bg-green-100 text-green-800`}
                  >
                    {rows.reduce((acc, row) => acc + row.address_updated, 0)}
                  </span>
                </h3>
              </>
            </div>
            {rows.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Total Entries</th>
                    <th className="p-3 text-left">Address Updated</th>
                    <th className="p-3 text-left">Date Range</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3">{row.user_name}</td>
                      <td className="p-3">{row.total_entries}</td>
                      <td className="p-3">{row.address_updated}</td>
                      <td className="p-3">
                        {fromDate} → {toDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No data found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
