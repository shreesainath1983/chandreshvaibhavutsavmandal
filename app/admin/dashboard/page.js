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

  const formatDateValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${monthNames[date.getMonth()]}-${date.getFullYear()}`;
  };

  const formatDateTimeValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const datePart = formatDateValue(value);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${datePart} ${hours}:${minutes}:${seconds}`;
  };

  const downloadCsv = () => {
    if (!rows.length) return;

    const headers = [
      "receipt_no",
      "donor_name",
      "donor_address",
      "mobile",
      "amount",
      "payment_mode",
      "transaction_ref",
      "receipt_date",
      "event",
      "remark",
      "created_at",
      "is_cancelled",
      "cancelled_by",
      "cancelled_at",
      "cancel_reason",
      "received_by",
    ];

    const escapeCsv = (value) => {
      if (value == null) return "";
      const stringValue = String(value);
      if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvRows = rows.map((row) => [
      row.receipt_no,
      row.donor_name,
      row.donor_address,
      row.mobile,
      row.amount,
      row.payment_mode,
      row.transaction_ref,
      formatDateValue(row.receipt_date),
      row.event,
      row.remark,
      formatDateTimeValue(row.created_at),
      row.is_cancelled,
      row.cancelled_by,
      row.cancelled_at,
      row.cancel_reason,
      row.received_by?.name || "",
    ]);

    const csvContent = [headers, ...csvRows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `donations_${fromDate}_to_${toDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <button
            onClick={downloadCsv}
            disabled={loading || rows.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
          >
            Download CSV
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
              <h2 className="text-2xl font-bold">Donation Report</h2>
              <>
                <h3 className="text-2xl font-bold">
                  Total donations:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-lg font-semibold bg-blue-100 text-blue-800`}
                  >
                    {rows.length}
                  </span>
                </h3>
                <h3 className="text-2xl font-bold">
                  Total amount:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-lg font-semibold bg-green-100 text-green-800`}
                  >
                    {rows.reduce(
                      (acc, row) => acc + Number(row.amount || 0),
                      0,
                    )}
                  </span>
                </h3>
              </>
            </div>
            {rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Receipt No</th>
                      <th className="p-3 text-left">Donor Name</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-left">Mobile</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Payment Mode</th>
                      <th className="p-3 text-left">Transaction Ref</th>
                      <th className="p-3 text-left">Receipt Date</th>
                      <th className="p-3 text-left">Event</th>
                      <th className="p-3 text-left">Remark</th>
                      <th className="p-3 text-left">Created At</th>
                      <th className="p-3 text-left">Cancelled</th>
                      <th className="p-3 text-left">Cancelled By</th>
                      <th className="p-3 text-left">Cancelled At</th>
                      <th className="p-3 text-left">Cancel Reason</th>
                      <th className="p-3 text-left">Received By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-200 transition ${
                          row.is_cancelled ? "bg-red-100" : "hover:bg-blue-50"
                        }`}
                      >
                        <td className="p-3">{row.receipt_no}</td>
                        <td className="p-3">{row.donor_name}</td>
                        <td className="p-3">{row.donor_address}</td>
                        <td className="p-3">{row.mobile}</td>
                        <td className="p-3">{row.amount}</td>
                        <td className="p-3">{row.payment_mode}</td>
                        <td className="p-3">{row.transaction_ref}</td>
                        <td className="p-3">
                          {formatDateValue(row.receipt_date)}
                        </td>
                        <td className="p-3">{row.event}</td>
                        <td className="p-3">{row.remark}</td>
                        <td className="p-3">
                          {formatDateTimeValue(row.created_at)}
                        </td>
                        <td className="p-3">{String(row.is_cancelled)}</td>
                        <td className="p-3">{row.cancelled_by?.name || ""}</td>
                        <td className="p-3">
                          {formatDateTimeValue(row.cancelled_at)}
                        </td>
                        <td className="p-3">{row.cancel_reason}</td>
                        <td className="p-3">{row.received_by?.name || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No data found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
