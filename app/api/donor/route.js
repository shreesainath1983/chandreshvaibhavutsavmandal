import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const epicNo = searchParams.get("epicNo");

    if (!epicNo) {
      return NextResponse.json(
        { error: "epicNo is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("voterdata")
      .select("*")
      .ilike("Epic", `${epicNo}%`)
      .single();

    if (error) {
      return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
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
    } = body;
    if (!donor_name || !amount || !mobile)
      return NextResponse.json(
        { error: "Mandatory fields are required" },
        { status: 400 },
      );

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

    const { data, error } = await supabase
      .from("donations")
      .insert([payload])
      .select()
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
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
      .from("donations")
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
