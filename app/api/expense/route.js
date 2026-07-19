import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      voucher_no,
      expense_date,
      paid_to,
      event,
      payment_for,
      remark,
      created_by,
      particulars,
    } = body;

    if (!voucher_no || !paid_to || !payment_for || !created_by) {
      return NextResponse.json(
        {
          error: "voucher_no, paid_to, payment_for and created_by are required",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(particulars) || particulars.length === 0) {
      return NextResponse.json(
        { error: "At least one expense particular is required" },
        { status: 400 },
      );
    }

    const voucherPayload = {
      voucher_no,
      expense_date,
      paid_to,
      event,
      payment_for,
      remark,
      created_by,
      is_cancelled: false,
      created_at: new Date().toISOString(),
    };

    const { data: voucherData, error: voucherError } = await supabase
      .from("expense_vouchers")
      .insert([voucherPayload])
      .select()
      .single();

    if (voucherError) {
      return NextResponse.json(
        { error: voucherError.message },
        { status: 400 },
      );
    }

    const particularsPayload = particulars.map((item) => ({
      expense_voucher_id: voucherData.id,
      particular: item.particular,
      amount: item.amount,
      created_at: new Date().toISOString(),
    }));

    const { data: particularsData, error: particularsError } = await supabase
      .from("expense_particulars")
      .insert(particularsPayload)
      .select();

    if (particularsError) {
      await supabase.from("expense_vouchers").delete().eq("id", voucherData.id);
      return NextResponse.json(
        { error: particularsError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      data: { ...voucherData, particulars: particularsData },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, cancelled_by, cancel_reason } = body;

    if (
      !id ||
      !cancelled_by ||
      !cancel_reason ||
      cancel_reason.trim().length < 3
    ) {
      return NextResponse.json(
        {
          error:
            "id, cancelled_by, and cancel_reason (min 3 chars) are required",
        },
        { status: 400 },
      );
    }

    const payload = {
      is_cancelled: true,
      cancelled_by,
      cancel_reason: cancel_reason.trim(),
      cancelled_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("expense_vouchers")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
