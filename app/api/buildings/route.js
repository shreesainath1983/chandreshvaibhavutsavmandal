import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabase
    .from("buildings")
    .select("*, layouts:layout_id(name)")
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      area,
      wings,
      total_flats,
      total_shops,
      extra_data,
      layout_id,
    } = body;
    if (!name)
      return NextResponse.json({ error: "name required" }, { status: 400 });

    const payload = {
      name,
      area: area || null,
      wings: wings || null,
      total_flats: total_flats || null,
      total_shops: total_shops || null,
      extra_data: extra_data || null,
      layout_id: layout_id || null,
    };

    const { data, error } = await supabase
      .from("buildings")
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
