import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabaseServer";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if (!fromDate || !toDate) {
    return NextResponse.json(
      { error: "From date and To date are required" },
      { status: 400 },
    );
  }

  const fromDateTime = `${fromDate} 00:00:00`;
  const toDateTime = `${toDate} 23:59:59`;

  const { data, error } = await supabase
    .from("expense_vouchers")
    .select(
      `
      id,
      voucher_no,
      expense_date,
      paid_to,
      payment_for,
      event,
      remark,
      created_at,
      is_cancelled,
      cancelled_by (
        id,
        name
      ),
      cancelled_at,
      cancel_reason,
      created_by (
        id,
        name
      ),
      expense_particulars (
        id,
        particular,
        amount
      )
    `,
    )
    .gte("expense_date", fromDateTime)
    .lte("expense_date", toDateTime)
    .order("expense_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data || []).map((row) => ({
    ...row,
    amount: row.expense_particulars?.reduce(
      (sum, item) => sum + (item?.amount ? Number(item.amount) : 0),
      0,
    ),
  }));

  return NextResponse.json({ data: rows });
}
