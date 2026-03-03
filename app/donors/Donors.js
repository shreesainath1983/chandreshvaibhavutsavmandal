import { useEffect, useRef, useState } from "react";
import { addDonor, getDonorsByUser, getLatestCounter } from "./donorService";
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
    const amountInWords = numberToRupeesWords(data.amount);
    const donorWithWords = { ...data, amountInWords, received_by: user.name };
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
    if (!data.mobile) {
      alert("Enter mobile number");
      return;
    }

    const msg = `Hi ${data.donor_name}, thank you for your donation to our Mandal. Your receipt is attached.

Thank you 🙏
Chandresh Vaibhav Utsav Mandal`;

    window.open(
      `https://wa.me/91${data.mobile}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
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
