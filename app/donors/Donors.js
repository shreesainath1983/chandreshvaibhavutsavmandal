import { useEffect, useRef, useState } from "react";
import {
  addDonor,
  getDonorsByUser,
  getLatestCounter,
  cancelDonorReceipt,
} from "./donorService";
import { formatDateToDDMMMYYYY, numberToRupeesWords } from "../common";
import Receipt from "./Receipt";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaWhatsapp, FaDownload } from "react-icons/fa";

const Donors = ({ user }) => {
  const receiptRef = useRef(null);
  const [donors, setDonors] = useState(null);
  const [donor, setDonor] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelReceipt, setCancelReceipt] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadDonors = async () => {
    try {
      const result = await getDonorsByUser(user.id);
      if (result.ok && result.data) {
        setDonors(result.data);
      } else {
        setError(result.error || "Failed to load donors");
      }
    } catch (err) {
      setError("Failed to load donors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      loadDonors();
    }
  }, [user]);

  const downloadReceipt = (data) => {
    if (data.is_cancelled) return;
    const amountInWords = numberToRupeesWords(data.amount);
    const receiptDate = formatDateToDDMMMYYYY(data.receipt_date);
    const donorWithWords = {
      ...data,
      amountInWords,
      received_by: user.name,
      receipt_date: receiptDate,
    };
    setDonor(donorWithWords);
    // wait for hidden receipt to update
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          onclone: (clonedDocument) => {
            // Remove all style tags and links to avoid oklch color parsing
            const styles = clonedDocument.querySelectorAll(
              "style, link[rel='stylesheet']",
            );
            styles.forEach((style) => style.remove());

            // Remove all class names to prevent Tailwind classes from being applied
            const allElements = clonedDocument.querySelectorAll("*");
            allElements.forEach((el) => {
              try {
                // Skip SVG elements that have read-only className
                if (el.setAttribute) {
                  el.setAttribute("class", "");
                }
              } catch {
                // Silently skip elements that can't have class removed
              }
            });
          },
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save(`${data.donor_name}_${data.receipt_no}.pdf`);
      } catch (error) {
        console.error("Error generating receipt:", error);
        setError("Failed to download receipt. Please try again.");
      }
    }, 100);
  };

  const openWhatsApp = (data) => {
    if (data.is_cancelled) return;
    if (!data.mobile) {
      alert("Enter mobile number");
      return;
    }

    const msg = `Hi ${data.donor_name}, 
    
Your donation of ₹${data.amount} to our mandal is confirmed. Your receipt is attached.

Thank you 🙏
Chandresh Vaibhav Utsav Mandal`;

    window.open(
      `https://wa.me/91${data.mobile}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const openCancelModal = (donorData) => {
    setCancelReceipt(donorData);
    setCancelReason("");
    setCancelError("");
  };

  const closeCancelModal = () => {
    setCancelReceipt(null);
    setCancelReason("");
    setCancelError("");
    setCancelLoading(false);
  };

  const confirmCancelReceipt = async () => {
    if (!cancelReceipt) return;
    if (cancelReason.trim().length < 3) {
      setCancelError("Cancel reason must be at least 3 characters.");
      return;
    }

    setCancelLoading(true);
    setCancelError("");

    try {
      const result = await cancelDonorReceipt(
        cancelReceipt.id,
        user.id,
        cancelReason.trim(),
      );

      if (!result.ok) {
        setCancelError(result.error || "Failed to cancel receipt.");
        return;
      }

      setDonors((current) =>
        current.map((item) =>
          item.id === cancelReceipt.id
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
      setCancelError("Failed to cancel receipt.");
      console.error(err);
    } finally {
      setCancelLoading(false);
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
    <div className="bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Donors ({donors?.length || 0})
      </h2>
      {donors && donors.length > 0 ? (
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Action
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Receipt No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Receipt Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Payment Mode
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Event
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Mobile
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Remark
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">
                  Cancel
                </th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 transition ${
                    donor.is_cancelled ? "bg-red-100" : "hover:bg-blue-50"
                  }`}
                >
                  <td>
                    <div className="flex items-center gap-3 px-4 py-3">
                      {!donor.is_cancelled ? (
                        <>
                          <FaDownload
                            size={24}
                            className="text-blue-500 cursor-pointer"
                            title="Download"
                            onClick={() => downloadReceipt(donor)}
                          />
                          <FaWhatsapp
                            size={28}
                            className="text-green-500 cursor-pointer"
                            title="WhatsApp"
                            onClick={() => openWhatsApp(donor)}
                          />
                        </>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {donor.receipt_no}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDateToDDMMMYYYY(donor.receipt_date)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {donor.donor_name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{donor.amount} /-</td>
                  <td className="px-4 py-3 text-gray-700">
                    {donor.payment_mode}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{donor.event}</td>
                  <td className="px-4 py-3 text-gray-700">{donor.mobile}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {donor.remark || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {!donor.is_cancelled ? (
                      <button
                        type="button"
                        onClick={() => openCancelModal(donor)}
                        className="rounded-lg bg-red-600 px-3 py-2 cursor-pointer text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-sm text-red-700 font-semibold">
                        Cancelled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-600 text-lg">No donors found</p>
        </div>
      )}
      {cancelReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Cancel Receipt {cancelReceipt.receipt_no}
            </h3>
            <div className="mb-5 rounded-lg bg-gray-50 p-4 space-y-3 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Donor Name:
                </span>
                <span className="text-sm text-gray-900">
                  {cancelReceipt.donor_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Amount:
                </span>
                <span className="text-sm text-gray-900">
                  ₹{cancelReceipt.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Receipt Date:
                </span>
                <span className="text-sm text-gray-900">
                  {formatDateToDDMMMYYYY(cancelReceipt.receipt_date)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please confirm cancellation and provide a reason. This action will
              mark the receipt as cancelled.
            </p>
            <label className="block text-sm font-semibold mb-2">
              Cancel Reason
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
              rows={2}
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
                onClick={confirmCancelReceipt}
                disabled={cancelLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelLoading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hidden receipt (used only for PDF capture) */}
      <div
        style={{
          position: "fixed",
          top: "-10000px",
          left: "-10000px",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        {donor && <Receipt ref={receiptRef} donor={donor} />}
      </div>
    </div>
  );
};

export default Donors;
