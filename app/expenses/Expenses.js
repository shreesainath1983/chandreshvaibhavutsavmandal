import { useEffect, useState } from "react";
import { cancelExpense, getExpensesByUser } from "./expenseService";
import { formatDateToDDMMMYYYY } from "../common";

const Expenses = ({ user }) => {
  const [expenses, setExpenses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelExpenseItem, setCancelExpenseItem] = useState(null);
  const [detailExpenseItem, setDetailExpenseItem] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadExpenses = async () => {
    try {
      const result = await getExpensesByUser(user.id);
      if (result.ok && result.data) {
        setExpenses(result.data);
      } else {
        setError(result.error || "Failed to load expense vouchers");
      }
    } catch (err) {
      setError("Failed to load expense vouchers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      loadExpenses();
    }
  }, [user]);

  const openCancelModal = (expense) => {
    setCancelExpenseItem(expense);
    setCancelReason("");
    setCancelError("");
  };

  const openDetailsModal = (expense) => {
    setDetailExpenseItem(expense);
  };

  const closeDetailsModal = () => {
    setDetailExpenseItem(null);
  };

  const closeCancelModal = () => {
    setCancelExpenseItem(null);
    setCancelReason("");
    setCancelError("");
    setCancelLoading(false);
  };

  const confirmCancelExpense = async () => {
    if (!cancelExpenseItem) return;
    if (cancelReason.trim().length < 3) {
      setCancelError("Cancel reason must be at least 3 characters.");
      return;
    }

    setCancelLoading(true);
    setCancelError("");

    try {
      const result = await cancelExpense(
        cancelExpenseItem.id,
        user.id,
        cancelReason.trim(),
      );

      if (!result.ok) {
        setCancelError(result.error || "Failed to cancel voucher.");
        return;
      }

      setExpenses((current) =>
        current.map((item) =>
          item.id === cancelExpenseItem.id
            ? {
                ...item,
                is_cancelled: true,
                cancelled_by: user.id,
                cancelled_at: new Date().toISOString(),
                cancel_reason: cancelReason.trim(),
              }
            : item,
        ),
      );
      closeCancelModal();
    } catch (err) {
      setCancelError("Failed to cancel voucher.");
      console.error(err);
    } finally {
      setCancelLoading(false);
    }
  };

  const computeTotal = (expense) => {
    const particulars = expense.expense_particulars || [];
    if (particulars.length === 0) return 0;
    return particulars.reduce((sum, item) => {
      const amount = parseFloat(item.amount);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Expense Vouchers ({expenses?.length || 0})
      </h2>
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-4">
          {error}
        </div>
      )}
      {expenses && expenses.length > 0 ? (
        <div className="overflow-x-auto max-h-[560px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Action
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Voucher
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Paid To
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Payment For
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Event
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Remarks
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Cancel
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const totalAmount = computeTotal(expense);
                return (
                  <tr
                    key={expense.id}
                    className={`border-b border-gray-200 transition ${
                      expense.is_cancelled ? "bg-red-100" : "hover:bg-blue-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-700">
                      {expense.is_cancelled ? (
                        <span className="text-red-600 font-semibold">
                          Cancelled
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openCancelModal(expense)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {expense.voucher_no}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDateToDDMMMYYYY(expense.expense_date)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {expense.paid_to}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {expense.payment_for}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-3">
                      <span>₹{totalAmount.toFixed(2)}</span>
                      {expense.expense_particulars?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => openDetailsModal(expense)}
                          className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          View({expense.expense_particulars.length})
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{expense.event}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {expense.remark || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {expense.is_cancelled ? (
                        <span className="text-sm text-red-700 font-semibold">
                          Cancelled
                        </span>
                      ) : (
                        <span className="text-sm text-gray-600">Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-600 text-lg">No expense vouchers found</p>
        </div>
      )}

      {cancelExpenseItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Cancel Expense Voucher {cancelExpenseItem.voucher_no}
            </h3>
            <div className="mb-5 rounded-lg bg-gray-50 p-4 space-y-3 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Paid To:
                </span>
                <span className="text-sm text-gray-900">
                  {cancelExpenseItem.paid_to}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Amount:
                </span>
                <span className="text-sm text-gray-900">
                  ₹{computeTotal(cancelExpenseItem).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Date:
                </span>
                <span className="text-sm text-gray-900">
                  {formatDateToDDMMMYYYY(cancelExpenseItem.expense_date)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please confirm cancellation and provide a reason. This action will
              mark the voucher as cancelled.
            </p>
            <label className="block text-sm font-semibold mb-2">
              Cancel Reason
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Enter reason for cancellation"
            />
            {cancelError && (
              <p className="mt-2 text-sm text-red-600">{cancelError}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={closeCancelModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={confirmCancelExpense}
                disabled={cancelLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelLoading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
      {detailExpenseItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Particulars for {detailExpenseItem.voucher_no}
                </h3>
                <p className="text-sm text-gray-600">
                  Paid To: {detailExpenseItem.paid_to}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetailsModal}
                className="rounded-full bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                      Particular
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detailExpenseItem.expense_particulars?.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.particular}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        ₹{Number(item.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right text-gray-700 font-semibold">
              Total: ₹{computeTotal(detailExpenseItem).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
