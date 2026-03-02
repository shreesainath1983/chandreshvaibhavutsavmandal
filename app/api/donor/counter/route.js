import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User Id is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("donations")
      .select("id,receipt_no")
      .eq("received_by", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: "Failed to retrieve latest receipt counter" },
        { status: 400 },
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
