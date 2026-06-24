import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

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
    .from("donations")
    .select(
      `
      receipt_no,
      donor_name,
      donor_address,
      mobile,
      amount,
      payment_mode,
      transaction_ref,
      receipt_date,
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
      received_by (
        id,
        name
      )
    `,
    )
    .gte("receipt_date", fromDateTime)
    .lte("receipt_date", toDateTime)
    .order("receipt_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data,
  });
}
