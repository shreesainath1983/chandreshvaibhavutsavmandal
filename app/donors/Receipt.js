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
      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        Donation Receipt
      </h2>
      <hr />

      <p>
        <b>Receipt No:</b> #{donor.receiptNo}
      </p>
      <p>
        <b>Name:</b> {donor.name}
      </p>
      <p>
        <b>Mobile:</b> {donor.mobile}
      </p>
      <p>
        <b>Amount:</b> ₹{donor.amount}
      </p>
      <p>
        <b>Date:</b> {donor.date}
      </p>

      <div style={{ marginTop: 20, fontSize: 12 }}>
        <p>Thank you for your kind support 🙏</p>
        <p>Donations are used for social and community welfare.</p>
      </div>
    </div>
  );
});

export default Receipt;
