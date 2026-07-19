import { useEffect, useMemo, useState } from "react";
import { addExpense, getLatestCounter } from "./expenseService";
import {
  eventList,
  formatDateToDDMMMYYYY,
  generateVoucherNo,
  numberToRupeesWords,
} from "../common";

export default function Entry({ user }) {
  const todayISO = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    voucher_no: "",
    expense_date: formatDateToDDMMMYYYY(todayISO),
    expense_date_iso: todayISO,
    paid_to: "",
    event: eventList[0]?.value || "",
    payment_for: "",
    remark: "",
    created_by: user ? user.id : "",
  });
  const [particulars, setParticulars] = useState([
    { id: 1, particular: "", amount: "" },
  ]);

  useEffect(() => {
    if (!user?.id) return;
    fetchVoucherCounter();
  }, [user]);

  const fetchVoucherCounter = async () => {
    try {
      setLoading(true);
      const result = await getLatestCounter(user.id);
      if (result.ok) {
        const latest = result.data?.length > 0 ? result.data[0] : null;
        const counter = latest?.voucher_no
          ? parseInt(latest.voucher_no.split("/").pop()) + 1
          : 1;
        setFormData((prev) => ({
          ...prev,
          voucher_no: generateVoucherNo(user.id, counter, new Date()),
        }));
      } else {
        setError(result.error || "Failed to generate voucher number");
      }
    } catch (err) {
      setError("Failed to generate voucher number");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = useMemo(() => {
    return particulars.reduce((sum, item) => {
      const amount = parseFloat(item.amount);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  }, [particulars]);

  const handleParticularChange = (index, field, value) => {
    setParticulars((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleAddRow = () => {
    setParticulars((prev) => [
      ...prev,
      { id: Date.now(), particular: "", amount: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    setParticulars((prev) => {
      const next = [...prev];
      if (next.length <= 1) return next;
      next.splice(index, 1);
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const iso = e.target.value;
    setFormData((prev) => ({
      ...prev,
      expense_date_iso: iso,
      expense_date: formatDateToDDMMMYYYY(iso),
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.paid_to.trim() || !formData.payment_for.trim()) {
      setError("Paid to and payment purpose are required.");
      return;
    }

    const validParticulars = particulars.filter(
      (item) =>
        item.particular.trim() && !Number.isNaN(parseFloat(item.amount)),
    );

    if (validParticulars.length === 0) {
      setError("At least one valid particular with amount is required.");
      return;
    }

    if (totalAmount <= 0) {
      setError("Particular amounts must add up to a value greater than 0.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        voucher_no: formData.voucher_no,
        expense_date: new Date(formData.expense_date_iso).toISOString(),
        paid_to: formData.paid_to,
        event: formData.event,
        payment_for: formData.payment_for,
        remark: formData.remark,
        created_by: parseInt(formData.created_by, 10),
        particulars: validParticulars.map((item) => ({
          particular: item.particular,
          amount: parseFloat(item.amount),
        })),
      };

      const result = await addExpense(payload);
      if (result.ok && result.data) {
        alert("Expense voucher added successfully!");
        setParticulars([{ id: 1, particular: "", amount: "" }]);
        setFormData((prev) => ({
          ...prev,
          paid_to: "",
          event: eventList[0]?.value || "",
          payment_for: "",
          remark: "",
        }));
        fetchVoucherCounter();
      } else {
        setError(result.error || "Failed to save expense voucher.");
      }
    } catch (err) {
      setError("Failed to save expense voucher.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    <form onSubmit={handleAddExpense} className="max-w-5xl mx-auto space-y-6">
      {error && (
        <div className="rounded-lg bg-red-100 border border-red-300 text-red-700 p-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Voucher Number
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="voucher_no"
            value={formData.voucher_no}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expense Date
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="expense_date_iso"
            value={formData.expense_date_iso}
            onChange={handleDateChange}
            max={todayISO}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Paid To *
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter recipient name"
            name="paid_to"
            value={formData.paid_to}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment For *
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter payment purpose"
            name="payment_for"
            value={formData.payment_for}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="event"
            value={formData.event}
            onChange={handleChange}
          >
            {eventList.map((eventType) => (
              <option key={eventType.value} value={eventType.value}>
                {eventType.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Remark
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter remark"
            name="remark"
            rows={3}
            value={formData.remark}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Particulars</h3>
          <button
            type="button"
            onClick={handleAddRow}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Add Item
          </button>
        </div>
        <div className="space-y-4">
          {particulars.map((row, index) => (
            <div
              key={row.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Particular
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter particular"
                  value={row.particular}
                  onChange={(e) =>
                    handleParticularChange(index, "particular", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                  value={row.amount}
                  onChange={(e) =>
                    handleParticularChange(index, "amount", e.target.value)
                  }
                />
              </div>
              <div className="flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right text-gray-700">
          Total Amount:{" "}
          <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
        </div>
        {totalAmount > 0 && (
          <div className="mt-2 text-right text-sm text-gray-600">
            In words:{" "}
            <span className="font-semibold">
              {numberToRupeesWords(totalAmount)}
            </span>
          </div>
        )}
      </div>
      <button
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition"
        type="submit"
      >
        Save Expense Voucher
      </button>
    </form>
  );
}
