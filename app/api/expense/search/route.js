import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const voucherNo = searchParams.get("voucherNo");
    const userId = searchParams.get("userId");

    if (voucherNo) {
      const { data, error } = await supabase
        .from("expense_vouchers")
        .select("*, expense_particulars(*)")
        .eq("voucher_no", voucherNo)
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Voucher not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ data });
    }

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("expense_vouchers")
      .select("*, expense_particulars(*)")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch expense vouchers" },
        { status: 400 },
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
