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
        <div style={{ color: "#5e5e5e" }}>Estd. 2025</div>
        <div style={{ color: "red" }}>।। श्री गणेशाय नमः ।।</div>
        <div style={{ color: "#5e5e5e" }}>
          Year: {new Date().getFullYear() - 2025 + 1}
        </div>
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <div style={{ width: "60px", height: "60px", marginTop: 2 }}>
          <img src="../images/onlyLogo.png" width="60px" height="60px" />
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
            CHANDRESH VAIBHAV UTSAV MANDAL
          </h1>
          <p
            style={{ margin: 0, fontSize: 12, color: "#5e5e5e", marginTop: 4 }}
          >
            Chandresh Vaibhav Co. Ho. Soc., Achole Road, Nallasopara East -
            401209
          </p>
        </div>
        <div style={{ width: "40px", marginTop: 2 }}>
          <img src="../images/CSM.png" width="40px" height="auto" />
        </div>
      </div>
      <hr />

      <div style={{ textAlign: "center", margin: "10px 0", color: "#532d75" }}>
        Donation Receipt
      </div>
      <table style={{ width: "100%", marginBottom: 20 }}>
        <tbody>
          <tr>
            <td style={{ padding: "5px" }}>
              <b>Receipt No:</b> {donor.receipt_no}
            </td>
            <td style={{ padding: "5px" }}>
              <b>Date:</b>{" "}
              {new Date(donor.receipt_date).toLocaleDateString("en-IN")}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: "5px" }}>
              <b>Name:</b> {donor.donor_name}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: "5px" }}>
              <b>Amount: </b> ₹{donor.amount}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: "5px" }}>
              <b>Payment Mode:</b> {donor.payment_mode}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: "5px" }}>
              <b>Amount in Words:</b> {donor.amountInWords}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: "5px" }}>
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
