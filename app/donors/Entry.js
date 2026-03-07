import { useEffect, useState } from "react";
import {
  eventList,
  formatDateToDDMMMYYYY,
  generateReceiptNo,
  numberToRupeesWords,
  paymentModes,
  validateMobile,
} from "../common";
import { addDonor, getLatestCounter } from "./donorService";

// Entry.js
export default function Entry({ user }) {
  const [loading, setLoading] = useState(true); // This should ideally come from the backend to ensure uniqueness
  const todayISO = new Date().toISOString().split("T")[0];
  const receiptDate = formatDateToDDMMMYYYY(todayISO);
  const initFormData = {
    receipt_no: "",
    donor_name: "",
    donor_address: "",
    receipt_date: receiptDate,
    receipt_date_iso: todayISO,
    amount: "",
    mobile: "",
    payment_mode: paymentModes[0].value,
    transaction_ref: "",
    event: eventList[0].value,
    received_by: user ? user.id : "",
    remark: "",
  };
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initFormData);

  useEffect(() => {
    fetchReceiptCounter();
  }, []);

  const fetchReceiptCounter = async () => {
    try {
      setLoading(true);
      const result = await getLatestCounter(user.id);
      if (result.ok && result.data) {
        const { id, receipt_no } =
          result.data?.length > 0
            ? result.data[0]
            : { id: 0, receipt_no: null };
        const counter = receipt_no ? parseInt(receipt_no.split("/")[2]) + 1 : 1; // Extract counter from receipt_no and increment

        setFormData({
          ...initFormData,
          receipt_no: generateReceiptNo(user.id, counter, new Date()), // For now, using 1 as counter. This should ideally come from the backend.
        });
        setLoading(false);
      } else {
        setError(result.error || "Failed to generate receipt number");
      }
    } catch (err) {
      setError("Failed to generate receipt number");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const iso = e.target.value;
    setFormData((prev) => ({
      ...prev,
      receipt_date_iso: iso,
      receipt_date: formatDateToDDMMMYYYY(iso),
    }));
  };

  const handleAddDonor = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.donor_name ||
      isNaN(formData.amount) ||
      formData.mobile.trim() === ""
    ) {
      setError("Name, amount and mobile number are required");
      return;
    }
    if (!validateMobile(formData.mobile)) {
      setError("Invalid mobile number. It should be a 10-digit number.");
      return;
    }

    setLoading(true);
    try {
      const result = await addDonor({
        ...formData,
        received_by: parseInt(formData.received_by),
      });
      if (result.ok && result.data) {
        alert("Donor added successfully!");
        // Refresh users list
        fetchReceiptCounter();
      } else {
        setError(result.error || "Failed to add a donor");
      }
    } catch (err) {
      setError("Failed to add a donor");
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
    <form onSubmit={handleAddDonor} className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Receipt No
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
            placeholder="Enter Receipt No"
            name="receipt_no"
            value={formData.receipt_no}
            disabled={true}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Receipt Date
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
            name="receipt_date_iso"
            value={formData.receipt_date_iso}
            onChange={handleDateChange}
            max={todayISO}
            //disabled={true}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name *
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
            placeholder="Enter Donor Name"
            name="donor_name"
            value={formData.donor_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount *
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
            placeholder="Enter Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment Mode *
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700"
            name="payment_mode"
            value={formData.payment_mode}
            onChange={handleChange}
          >
            {paymentModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment Reference
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
            placeholder="Enter Payment Reference"
            name="payment_reference"
            value={formData.payment_reference}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile *
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
            placeholder="Enter Mobile"
            name="mobile"
            type="number"
            maxLength={10}
            minLength={10}
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event *
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700"
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
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Donor Address
        </label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
          placeholder="Enter Donor Address"
          name="donor_address"
          rows="3"
          value={formData.donor_address}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Remark
        </label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
          placeholder="Enter Remark"
          name="remark"
          rows="2"
          value={formData.remark}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="text-sm block mb-2">
          Received By:{" "}
          <span className="font-semibold text-purple-700">
            {user ? `${user.name}` : ""}
          </span>
        </label>
      </div>
      {formData.amount && (
        <div>
          <label className="text-sm block mb-2">
            Amount in words:{" "}
            <span className="font-semibold text-purple-700">
              {numberToRupeesWords(formData.amount) || "Invalid amount"}
            </span>
          </label>
        </div>
      )}
      <button
        className="w-full cursor-pointer mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}
