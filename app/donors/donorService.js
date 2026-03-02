// donorService.js
// Service for fetching donor data from donations table

export async function getDonorsByUser(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const res = await fetch(
    `/api/donor/search?userId=${encodeURIComponent(userId)}`,
  );
  const result = await res.json();
  return { ok: res.ok, ...result };
}

export async function searchReceipt(receiptNo) {
  if (!receiptNo || receiptNo.trim() === "") {
    throw new Error("Receipt No is required");
  }

  const res = await fetch(
    `/api/donor/search?receiptNo=${encodeURIComponent(receiptNo.trim())}`,
  );
  const result = await res.json();
  return { ok: res.ok, ...result };
}

export async function getLatestCounter(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const res = await fetch(
    `/api/donor/counter?userId=${encodeURIComponent(userId)}`,
  );
  const result = await res.json();
  return { ok: res.ok, ...result };
}

export async function addDonor(userData) {
  const {
    receipt_no,
    donor_name,
    donor_address,
    receipt_date,
    amount,
    mobile,
    payment_mode,
    transaction_ref,
    event,
    received_by,
    remark,
  } = userData;

  if (!donor_name || !amount || !mobile) {
    throw new Error("Donor name, mobile and amount are required");
  }

  const payload = {
    receipt_no,
    donor_name,
    donor_address,
    receipt_date,
    amount,
    mobile,
    event,
    payment_mode,
    transaction_ref,
    received_by,
    remark,
  };

  const res = await fetch(`/api/donor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  return { ok: res.ok, data: result.data, error: result.error };
}
