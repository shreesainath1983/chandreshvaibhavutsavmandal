import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabase
    .from("members")
    .select(
      `
      id,
      name,
      email,
      mobile,
      role:role_id (
        role_id,
        role_name
      ),
      designation:designation_id (
        id,
        designation
      ),
      is_lock
    `,
    )
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  // flatten nested member_designation into designation_name for easier consumption
  const result = (data || []).map((r) => ({
    ...r,
    designation_name: r.member_designation ? r.member_designation.name : null,
  }));

  return NextResponse.json({ data: result });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role_id, is_lock } = body;
    if (!name || !email)
      return NextResponse.json(
        { error: "name and email required" },
        { status: 400 },
      );

    const payload = {
      name,
      email,
      password: password || null,
      role_id: role_id || null,
      is_lock: is_lock || true,
    };

    const { data, error } = await supabase
      .from("members")
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
