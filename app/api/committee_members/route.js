import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabase
    .from("committee_members")
    .select("*")
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { building_id, name, mobile, post, extra_data } = body;
    if (!building_id || !name)
      return NextResponse.json(
        { error: "building_id and name required" },
        { status: 400 }
      );

    const payload = {
      building_id,
      name,
      mobile: mobile || null,
      post: post || null,
      extra_data: extra_data || null,
    };
    const { data, error } = await supabase
      .from("committee_members")
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
