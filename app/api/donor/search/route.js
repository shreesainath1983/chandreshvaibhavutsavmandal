import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const receiptNo = searchParams.get("receiptNo");
    const userId = searchParams.get("userId");

    // If receiptNo provided, return the matching receipt (exact match)
    if (receiptNo) {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("receipt_no", receiptNo)
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Receipt not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ data });
    }

    // Otherwise require userId and return donor list for that user
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("received_by", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch donors" },
        { status: 400 },
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
