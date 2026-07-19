export async function getExpensesByUser(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const res = await fetch(
    `/api/expense/search?userId=${encodeURIComponent(userId)}`,
  );
  const result = await res.json();
  return { ok: res.ok, ...result };
}

export async function searchVoucher(voucherNo) {
  if (!voucherNo || voucherNo.trim() === "") {
    throw new Error("Voucher number is required");
  }

  const res = await fetch(
    `/api/expense/search?voucherNo=${encodeURIComponent(voucherNo.trim())}`,
  );
  const result = await res.json();
  return { ok: res.ok, ...result };
}

export async function getLatestCounter(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const res = await fetch(
    `/api/expense/counter?userId=${encodeURIComponent(userId)}`,
  );
  const result = await res.json();
  return { ok: res.ok, ...result };
}

export async function addExpense(expenseData) {
  const {
    voucher_no,
    expense_date,
    paid_to,
    event,
    payment_for,
    remark,
    created_by,
    particulars,
  } = expenseData;

  if (!voucher_no || !paid_to || !payment_for || !created_by)
    throw new Error(
      "Voucher number, paid to, payment purpose and user are required",
    );

  const payload = {
    voucher_no,
    expense_date,
    paid_to,
    event,
    payment_for,
    remark,
    created_by,
    particulars,
  };

  const res = await fetch(`/api/expense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  return { ok: res.ok, data: result.data, error: result.error };
}

export async function cancelExpense(expenseId, cancelledBy, cancelReason) {
  if (!expenseId || !cancelledBy || !cancelReason) {
    throw new Error("expenseId, cancelledBy and cancelReason are required");
  }

  const res = await fetch(`/api/expense`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: expenseId,
      cancelled_by: cancelledBy,
      cancel_reason: cancelReason,
    }),
  });

  const result = await res.json();
  return { ok: res.ok, data: result.data, error: result.error };
}
