import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, designation, layout_ids, extra_data } = body;
    if (!name)
      return NextResponse.json({ error: "name required" }, { status: 400 });

    const payload = {
      name,
      designation: designation || null,
      layout_ids:
        typeof layout_ids === "string"
          ? JSON.parse(layout_ids)
          : layout_ids || null,
      extra_data: extra_data || null,
    };

    const { data, error } = await supabase
      .from("candidates")
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
