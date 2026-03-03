"use client";
import React from "react";

const Receipt = React.forwardRef(({ donor }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        padding: 24,
        width: 500,
        background: "#fff",
        color: "#000",
        fontFamily: "Arial",
        border: "1px solid #ddd",
      }}
    >
      <div
        style={{
          color: "#d0d0d0",
          position: "absolute",
          margin: "100px 20px 20px 80px",
          height: 250,
          zIndex: 100,
          opacity: 0.1,
        }}
      >
        <img src="../images/logo.png" height={250} />
      </div>
      <div
        style={{
          display: "flex",
          gap: "5px",
          justifyContent: "space-between",
          marginBottom: 10,
          fontSize: 12,
        }}
      >
        <div style={{ color: "#5e5e5e" }}>स्थापना. 2025</div>
        <div style={{ color: "red" }}>।। श्री गणेशाय नमः ।।</div>
        <div style={{ color: "#5e5e5e" }}>
          वर्ष: {new Date().getFullYear() - 2025 + 1}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "5px",
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <div style={{ width: "55px", height: "60px", marginTop: 2 }}>
          <img src="../images/LT.png" width="55px" height="60px" />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              color: "#532d75",
              fontWeight: "bold",
            }}
          >
            चंद्रेश वैभव उत्सव मंडळ
          </h1>
          <p
            style={{ margin: 0, fontSize: 12, color: "#5e5e5e", marginTop: 4 }}
          >
            चंद्रेश वैभव कॉ. हो. सोस., अचोले रोड, नालासोपारा पूर्व - 401209
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: "bold",
              color: "#2b2b2b",
            }}
          >
            नोंदणी क्र. पालघर-0000923/2025
          </p>
        </div>
        <div style={{ width: "50px", marginTop: 2 }}>
          <img src="../images/CSM.png" width="50px" height="60px" />
        </div>
      </div>
      <hr />

      <div style={{ textAlign: "center", margin: "10px 0", color: "#532d75" }}>
        Donation Receipt
      </div>
      <table
        style={{
          width: "100%",
          marginBottom: 20,
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "5px", border: "1px solid #ddd" }}>
              <b>Receipt No:</b> {donor.receipt_no}
            </td>
            <td style={{ padding: "5px", border: "1px solid #ddd" }}>
              <b>Date:</b>{" "}
              {new Date(donor.receipt_date).toLocaleDateString("en-IN")}
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{ padding: "5px", border: "1px solid #ddd" }}
            >
              <b>Name:</b> {donor.donor_name}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "5px", border: "1px solid #ddd" }}>
              <b>Amount: </b> ₹{donor.amount}
            </td>
            <td style={{ padding: "5px", border: "1px solid #ddd" }}>
              <b>Payment Mode:</b> {donor.payment_mode}
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{ padding: "5px", border: "1px solid #ddd" }}
            >
              <b>Amount in Words:</b> {donor.amountInWords}
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{ padding: "5px", border: "1px solid #ddd" }}
            >
              <b>Event:</b> {donor.event}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          marginTop: 20,
          fontSize: 12,
          alignContent: "center",
          textAlign: "center",
          color: "#5e5e5e",
        }}
      >
        <p>Received by: {donor.received_by}</p>
        <p>Thank you for your kind support 🙏</p>
      </div>
    </div>
  );
});

export default Receipt;
